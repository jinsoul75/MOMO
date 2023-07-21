import { styled } from 'styled-components';
import {
  BASE_URL,
  REGISTER,
  REGISTER_COMMENT,
} from '../../../common/util/constantValue';
import Button from '../../../common/components/Button';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CommentToPost } from '../../../common/type';
import postComment from '../api/postComment';
import { useParams } from 'react-router-dom';

export default function CommentInput() {
  const [content, setContent] = useState('');

  const { id } = useParams();

  const memberId = Number(localStorage.getItem('MemberId'));

  const data = {
    memberId: memberId,
    content: content,
  };

  const queryClient = useQueryClient();

  const postMutation = useMutation<void, unknown, CommentToPost>(
    () => postComment(`${BASE_URL}/comments/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('comments');
        setContent('');
      },
    },
  );

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = () => {
    postMutation.mutate(data);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Container>
      <TitleSection>{REGISTER_COMMENT}</TitleSection>
      <InputSection>
        <textarea
          value={content}
          onChange={handleCommentChange}
          onKeyUp={handleKeyUp}
        />
      </InputSection>
      <ButtonSection>
        <Button children={REGISTER} onClick={handleSubmit} />
      </ButtonSection>
    </Container>
  );
}

const Container = styled.section`
  width: 50rem;
  display: flex;
  flex-direction: column;
  margin: 2rem 0 2rem 0;
  color: var(--color-black);
`;

const TitleSection = styled.section`
  margin-bottom: 1rem;
  font-family: 'BR-Bold';
`;

const InputSection = styled.section`
  margin-bottom: 1rem;

  > textarea {
    font-family: 'BR-regular';
    font-size: var(--font-size-s);
    width: 100%;
    border: 2px solid var(--color-black);
    border-radius: 5px;
    padding: 0.5rem;
    min-height: 5rem;
    resize: vertical;
    outline: none;
    line-height: 1.5;
    color: var(--color-black);
  }
`;

const ButtonSection = styled.section`
  display: flex;
  justify-content: end;
`;
