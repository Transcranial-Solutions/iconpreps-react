import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDebounce } from 'use-debounce';
import searchIcon from 'assets/icons/search.svg';
import CheckboxGroup from 'components/CheckboxGroup';
import { H3, Text } from 'components/Typography';
import { FILTER_ACTIONS } from 'utils/filters';
import { palette } from 'utils/designTokens';

const Container = styled.div`
  flex-shrink: 0;
  width: 26rem;
  padding: 3rem 2rem;
  background: ${palette.white};
  border: 1px solid ${palette.gray.border};
  border-radius: 0.6rem;
  box-shadow: 0 2px 5px 0 rgba(206, 210, 219, 0.5);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  font-size: 1.5rem;
  font-weight: 500;
  border: 1px solid ${palette.gray.border};
  border-radius: 0.4rem;
  padding: 0 1rem 0 4rem;
  margin-top: 2rem;
  background: no-repeat 1rem/2rem url(${searchIcon});

  &::placeholder {
    opacity: 0.25;
  }
`;

const OptionLabel = styled(Text)`
  flex: 1;
  margin-left: 1rem;
`;

const Separator = styled.hr`
  width: 100%;
  height: 1px;
  background: ${palette.gray.border};
  border: none;
  margin: 3rem 0;
`;

function PRepSearch({ filters, dispatch }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 400);

  useEffect(() => {
    dispatch({ type: FILTER_ACTIONS.SET_QUERY, payload: debouncedQuery });
  }, [debouncedQuery]); // eslint-disable-line

  useEffect(() => {
    if (filters.query !== query) {
      // Handle query being updated externally
      setQuery(filters.query);
    }
  }, [filters]); // eslint-disable-line

  function handleQueryChange(event) {
    setQuery(event.target.value);
  }

  function handleCategoriesChange(categories) {
    dispatch({ type: FILTER_ACTIONS.SET_CATEGORIES, payload: categories });
  }

  return (
    <Container>
      <H3>Search</H3>
      <SearchInput
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Search P-Reps"
      />
      <Separator />

      <H3>Category</H3>
      <CheckboxGroup
        options={[
          {
            value: 'Development',
            children: (
              <>
                <OptionLabel>Development</OptionLabel>
                <Text small muted>
                  30
                </Text>
              </>
            ),
          },
          {
            value: 'Education',
            children: (
              <>
                <OptionLabel>Education</OptionLabel>
                <Text small muted>
                  12
                </Text>
              </>
            ),
          },
          {
            value: 'Marketing',
            children: (
              <>
                <OptionLabel>Marketing</OptionLabel>
                <Text small muted>
                  11
                </Text>
              </>
            ),
          },
          {
            value: 'Community',
            children: (
              <>
                <OptionLabel>Community</OptionLabel>
                <Text small muted>
                  11
                </Text>
              </>
            ),
          },
          {
            value: 'Infrastructure',
            children: (
              <>
                <OptionLabel>Infrastructure</OptionLabel>
                <Text small muted>
                  2
                </Text>
              </>
            ),
          },
          {
            value: 'Other',
            children: (
              <>
                <OptionLabel>Other</OptionLabel>
                <Text small muted>
                  5
                </Text>
              </>
            ),
          },
        ]}
        values={filters.categories}
        onChange={handleCategoriesChange}
        name="categories"
        style={{ marginTop: '1rem' }}
      />
    </Container>
  );
}

PRepSearch.propTypes = {
  filters: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default PRepSearch;