import { AiFillDelete } from 'react-icons/ai';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import deleteArticle from '../api/deleteArticle';
import { ArticleToGet } from '../../../common/type';
import { BASE_URL } from '../../../common/util/constantValue';
import { MdModeEditOutline } from 'react-icons/md';
import peach_on from '../../../common/assets/icons/peach_on.svg';
import peach_off from '../../../common/assets/icons/peach_off.svg';
import comment from '../../../common/assets/icons/comment.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../common/store/RootStore';
import { setCreatedPost } from '../../Write,Edit/store/CreatedPost';
import { setLocation } from '../../../common/store/LocationStore';
import { setCategory } from '../../../common/store/CategoryStore';
import { useState } from 'react';
import UserModal from './UserModal';
import getLike from '../api/getLike';
import postLike from '../api/postLike';
import deleteLike from '../api/deleteLike';
import { useEffect } from 'react';

export default function Article({ data }: { data?: ArticleToGet }) {
  const [isLiked, setIsLiked] = useState(false);

  const [totalLikes, setTotalLikes] = useState(data?.likeCount || 0)

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const userInfo = { memberId: 2 };

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const totalComments = useSelector((state: RootState) => state.totalComments);

  //해당 포스트의 좋아요 데이터중 나의 아이디와 일치하는 데이터 있는지 get요청
  const { data: likeData } = useQuery(['getLike'], () =>
    getLike(`${BASE_URL}/likes/${id}`, userInfo.memberId),
  );
  //첫 랜더링시 유저의 좋아요 이력 여부에 따라 isLiked상태 변경
  useEffect(() => {
    if (likeData) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postLikeMutaion = useMutation(() =>
    postLike(`${BASE_URL}/posts/${id}`, userInfo.memberId),
  );

  const deleteLikeMutation = useMutation(() =>
    deleteLike(`${BASE_URL}/posts/${id}`, userInfo.memberId),
  );

  const deleteItemMutation = useMutation<void, unknown, void>(
    () => deleteArticle(`${BASE_URL}/posts/${id}/${userInfo.memberId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filteredLists');
        navigate(-1);
      },
    },
  );

  const handleEditClick = () => {
    dispatch(
      setCreatedPost({
        title: data?.title,
        content: data?.content,
        tags: data?.tags,
        categoryId: data?.categoryInfo.categoryId,
        locationId: data?.locationInfo.locationId,
        memberId: data?.memberInfo.memberId,
      }),
    );
    dispatch(
      setLocation({
        locationId: data?.locationInfo.locationId,
        city: data?.locationInfo.city,
        province: data?.locationInfo.province,
      }),
    );
    dispatch(
      setCategory({
        name: data?.categoryInfo.name,
        categoryId: data?.categoryInfo.categoryId,
      }),
    );
  };

  const handleDelete = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteItemMutation.mutate();
    }
  };

  const handleModalChange = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const handleClickLike = () => {
    if (isLiked) {
      console.log('시러요');
      setIsLiked(false);
      setTotalLikes((prevLikes)=>prevLikes-1)
      deleteLikeMutation.mutate();
    } else {
      console.log('조아요');
      setIsLiked(true);
      setTotalLikes((prevLikes)=>prevLikes+1)
      postLikeMutaion.mutate();
    }
  };

  return (
    <Container>
      {data ? (
        <>
          <TitleSection>
            <div>{data.title}</div>
            <div>
              {data.editedAt
                ? `${data.editedAt.slice(0, 10)} (수정됨)`
                : data.createdAt.slice(0, 10)}
            </div>
          </TitleSection>
          <AuthorSection>
            <img
              src={data.memberInfo.profileImage}
              alt="user"
              onClick={handleModalChange}
            />
            <div onClick={handleModalChange}>{data.memberInfo.nickname}</div>
            <UserModal
              isUserModalOpen={isUserModalOpen}
              handleModalChange={handleModalChange}
              data={data}
            />
          </AuthorSection>
          <ContentSection>
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </ContentSection>
          <TagSection>
            {data.tags.map((tag) => (
              <div key={tag}>{`#${tag}`}</div>
            ))}
          </TagSection>
          <InfoSection>
            <div>
              {userInfo.memberId === data?.memberInfo.memberId && (
                <Link to={`/write/${data?.postId}`} onClick={handleEditClick}>
                  <MdModeEditOutline size={24} />
                </Link>
              )}
              {userInfo.memberId === data?.memberInfo.memberId && (
                <AiFillDelete size={24} onClick={handleDelete} />
              )}
              {/* 클릭 시 삭제 확인 창 뜨게 수정해야함 */}
            </div>
            <div>
              <div>
                <Button type="button" onClick={handleClickLike}>
                  <img
                    src={isLiked ? `${peach_on}` : `${peach_off}`}
                    alt={isLiked ? 'Liked' : 'Not liked'}
                  />
                </Button>
                <div>{totalLikes}</div>
              </div>
              <div>
                <img src={comment} alt="comment" />
                <div>{totalComments}</div>
              </div>
            </div>
          </InfoSection>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Container>
  );
}

const Container = styled.article`
  border: 2px solid var(--color-black);
  border-radius: 10px;
  padding: 2rem;
  width: 50rem;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
  margin: 2rem 0 2rem 0;
  color: var(--color-black);
`;

const TitleSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid var(--color-black);
  padding-bottom: 1rem;

  > :first-child {
    font-size: var(--font-size-m);
  }

  > :nth-child(2) {
    font-size: var(--font-size-xs);
  }
`;

const AuthorSection = styled.section`
  display: flex;
  align-items: center;
  margin: 1rem 0 2rem 0;
  text-decoration: none;
  color: var(--color-black);
  position: relative;

  & img {
    border-radius: 50%;
    height: 2rem;
    width: 2rem;
    margin-right: 1rem;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 2rem;
  min-height: 20rem;
  line-height: 1.5;
`;

const TagSection = styled.section`
  display: flex;
  margin-bottom: 1rem;

  > div {
    margin-right: 1rem;
    border-radius: 5px;
    background: var(--color-gray);
    padding: 0.5rem;
  }
`;

const InfoSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :first-child {
    > a {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      color: var(--color-black);
    }

    > :nth-child(2) {
      cursor: pointer;
    }
  }

  > :nth-child(2) {
    > div {
      margin-left: 1rem;

      > div {
        margin-left: 0.25rem;
      }
    }
  }
  & div {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }

  & img {
    height: 1.5rem;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  height: 24px;
  cursor: pointer;
`;
