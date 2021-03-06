import React from 'react';
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from '@reach/listbox';
import '@reach/listbox/styles.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import closeIcon from 'assets/icons/close.svg';
import downArrowIcon from 'assets/icons/down-arrow-black.svg';
import settingsIcon from 'assets/icons/settings.svg';
import { H1, Text } from 'components/Typography';
import { breakpoints, palette } from 'utils/designTokens';

const Title = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media screen and (max-width: ${breakpoints.max.md}) {
    float: left;
    margin-top: 0.6rem;
  }
`;

const FiltersButton = styled.button`
  display: flex;
  align-items: center;
  float: right;
  font-weight: 600;
  font-size: 1.3rem;
  line-height: 1.8rem;
  color: ${palette.black};
  background: none;
  border: 1px solid ${palette.black};
  border-radius: 0.3rem;
  padding: 1rem 1.5rem;
  margin-left: 1.5rem;
  cursor: pointer;

  @media screen and (min-width: ${breakpoints.min.lg}) {
    display: none;
  }
`;

const FilterIcon = styled.img`
  flex-shrink: 0;
  width: 1.4rem;
  margin-right: 1rem;
`;

const Ordering = styled.div`
  display: none;

  #order-label {
    font-weight: 500;
  }

  @media screen and (min-width: ${breakpoints.min.lg}) {
    display: flex;
    align-items: center;
  }
`;

const DropdownInput = styled(ListboxInput)`
  margin-left: 1rem;
`;

const DropdownButton = styled(ListboxButton)`
  width: 16.5rem;
  height: 4rem;
  background: ${palette.white};
  border: 1px solid ${palette.gray.border};
  border-radius: 0.4rem;
  padding: 0 2rem;

  &:focus {
    outline: none;
    border-color: ${palette.brand.primary};
  }
`;

const DropdownPopover = styled(ListboxPopover)`
  background: ${palette.white};
  border: 1px solid ${palette.gray.border};
  border-radius: 0.3rem;
  padding: 0.5rem 0;
`;

const DropdownOption = styled(ListboxOption)`
  font-weight: 500;
  font-size: 1.3rem;
  line-height: 1.8rem;
  padding: 0.7rem 1.5rem;

  &[data-current] {
    font-weight: inherit;
    color: ${palette.black};
    background: ${palette.gray.border};
  }
  &[aria-selected='true'] {
    font-weight: 700;
    color: ${palette.black};
    background: none;
    &[data-current] {
      background: ${palette.gray.border};
    }
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 1px;
  margin-top: 1rem;
  clear: both;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: stretch;
  background: ${palette.white};
  overflow: hidden;
`;

const TagLabel = styled.div`
  padding: 0.9rem 1.5rem;
  border: 1px solid ${palette.gray.border};
  border-radius: 0.4rem 0 0 0.4rem;
  border-right: none;
`;

const TagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  padding: 0;
  background: none;
  border: none;
  border: 1px solid ${palette.gray.border};
  border-radius: 0 0.4rem 0.4rem 0;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${palette.brand.primary};
  }
`;

function DownArrow() {
  return <img src={downArrowIcon} alt="Down arrow" style={{ width: '0.9rem' }} />;
}

function SearchHeader({
  title,
  tags = [],
  order,
  orderings = [],
  onChangeOrdering,
  onShowFilters,
}) {
  return (
    <>
      <Title>
        <H1>{title}</H1>
        <Ordering>
          <Text small id="order-label">
            Sort&nbsp;by:
          </Text>
          <DropdownInput value={order} onChange={onChangeOrdering} aria-labelledby="order-label">
            <DropdownButton arrow={<DownArrow />} />
            <DropdownPopover>
              <ListboxList>
                {orderings.map(({ value, label }) => (
                  <DropdownOption value={value} key={value}>
                    {label}
                  </DropdownOption>
                ))}
              </ListboxList>
            </DropdownPopover>
          </DropdownInput>
        </Ordering>
      </Title>
      <FiltersButton type="button" onClick={onShowFilters}>
        <FilterIcon src={settingsIcon} alt="Filters" />
        Filters
      </FiltersButton>
      <Tags>
        {tags.map(({ label, rm }, index) => (
          <Tag
            key={label}
            style={{ marginTop: '1rem', marginRight: index !== tags.length - 1 ? '1rem' : 0 }}
          >
            <TagLabel>{label}</TagLabel>
            <TagButton onClick={rm}>
              <img
                src={closeIcon}
                alt="Remove item"
                style={{ width: '1.4rem', height: '1.4rem' }}
              />
            </TagButton>
          </Tag>
        ))}
      </Tags>
    </>
  );
}

SearchHeader.propTypes = {
  onChangeOrdering: PropTypes.func.isRequired,
  onShowFilters: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderings: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      rm: PropTypes.func.isRequired,
    })
  ),
  title: PropTypes.string.isRequired,
};

export default SearchHeader;
