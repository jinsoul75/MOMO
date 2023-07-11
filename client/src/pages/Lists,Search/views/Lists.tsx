import { styled } from 'styled-components';
import SearchBar from '../components/SearchBar';
import CategoryIcons from '../components/CategoryIcons';
import Cards from '../components/Cards';
import ListsHeader from '../components/ListsHeader';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setKeyword } from '../../../common/store/keywordStore';
import { useLocation } from 'react-router-dom';

export default function Lists() {
  const location = useLocation();
  const isPathLists = location.pathname  === '/lists';

  const dispatch = useDispatch();

  useEffect(() => {
    if (isPathLists) {
      dispatch(setKeyword(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <SearchBar />
      {isPathLists ? <CategoryIcons /> : null}
      <ListsHeader/>
      <Cards />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 5rem;
`;