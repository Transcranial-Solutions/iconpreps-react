import React, { useEffect, useReducer, useState } from 'react';
import { format, isAfter, parseISO, subDays } from 'date-fns';
import { take } from 'lodash-es';
import PropTypes from 'prop-types';
import noLogo from 'assets/no-logo.svg';
import { CardList } from 'components/Cards';
import Category from 'components/Category';
import Completion from 'components/Completion';
import FiltersHeader from 'components/FiltersHeader';
import Loading from 'components/Loading';
import { Logo, LogoWrapper } from 'components/Logo';
import { usePReps } from 'components/PReps';
import ProjectSearch from 'components/ProjectSearch';
import ProjectStatus from 'components/ProjectStatus';
import { useProjects } from 'components/Projects';
import Rating from 'components/Rating';
import SearchHeader from 'components/SearchHeader';
import { Text, UnstyledLink } from 'components/Typography';
import { DATE_FORMAT } from 'utils/constants';
import { palette } from 'utils/designTokens';
import {
  FILTER_ACTIONS,
  PROJECT_FILTERS,
  PROJECT_ORDERINGS,
  projectFilterReducer,
} from 'utils/filters';
import * as S from './ProjectList.styles';

const RECENT_ACTIVITY_TYPES = {
  UPDATED: { value: 'Updated', label: 'Updated in last 7 days', property: 'updated_date' },
  CREATED: { value: 'Created', label: 'Created in last 7 days', property: 'created_date' },
};

function isRecentProject(project, recentActivityType) {
  return isAfter(parseISO(project[recentActivityType.property]), subDays(new Date(), 7));
}

function ProjectList({ title, filtersToUse, additionalFilter }) {
  const { hasPReps } = usePReps();
  const { getProjects, hasProjects, isLoading } = useProjects();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, filtersDispatch] = useReducer(projectFilterReducer, PROJECT_FILTERS);
  const [tags, setTags] = useState([]);
  const [isShowingFilters, setIsShowingFilters] = useState(false);

  useEffect(() => {
    if (hasPReps && hasProjects) setProjects(getProjects());
  }, [hasPReps, hasProjects]); // eslint-disable-line

  useEffect(() => {
    let filtered = additionalFilter ? projects.filter(additionalFilter) : projects;
    filtered = filtered.filter(project => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (
          !(
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query)
          )
        ) {
          return false;
        }
      }

      if (filters.categories.length && !filters.categories.includes(project.category)) return false;

      if (filters.rating && String(filters.rating) > project.rating) return false;

      if (filters.status && filters.status !== project.status) return false;

      if (filters.recent) {
        const recentActivityType = Object.values(RECENT_ACTIVITY_TYPES).find(
          ({ value }) => value === filters.recent
        );
        if (recentActivityType && !isRecentProject(project, recentActivityType)) return false;
      }

      return true;
    });

    const ordered = filters.order.fn(filtered);

    setFilteredProjects(take(ordered, filters.limit));
  }, [filters, projects]); // eslint-disable-line

  useEffect(() => {
    const tags = [];
    if (filters.query) {
      tags.push({
        label: `Search for: ${filters.query}`,
        rm: () => filtersDispatch({ type: FILTER_ACTIONS.SET_QUERY, payload: '' }),
      });
    }
    if (filters.categories) {
      tags.push(
        ...filters.categories.map(category => ({
          label: category,
          rm: () => filtersDispatch({ type: FILTER_ACTIONS.REMOVE_CATEGORY, payload: category }),
        }))
      );
    }
    if (filters.rating) {
      tags.push({
        label: `${filters.rating} stars & up`,
        rm: () => filtersDispatch({ type: FILTER_ACTIONS.SET_RATING }),
      });
    }
    if (filters.recent) {
      tags.push({
        label: `${filters.recent} recently`,
        rm: () => filtersDispatch({ type: FILTER_ACTIONS.SET_RECENT }),
      });
    }
    if (filters.status) {
      tags.push({
        label: filters.status,
        rm: () => filtersDispatch({ type: FILTER_ACTIONS.SET_STATUS }),
      });
    }
    setTags(tags);
  }, [filters]);

  function handleChangeOrdering(orderValue) {
    const order = Object.values(PROJECT_ORDERINGS).find(({ value }) => value === orderValue);
    filtersDispatch({ type: FILTER_ACTIONS.SET_ORDER, payload: order });
  }

  return (
    <S.Container>
      <S.Filters showing={isShowingFilters}>
        <FiltersHeader
          order={filters.order.value}
          orderings={Object.values(PROJECT_ORDERINGS)}
          onChangeOrdering={handleChangeOrdering}
          onCloseFilters={() => setIsShowingFilters(false)}
        />
        <ProjectSearch filters={filters} dispatch={filtersDispatch} filtersToUse={filtersToUse} />
      </S.Filters>

      <S.Listing>
        <SearchHeader
          title={title}
          tags={tags}
          order={filters.order.value}
          orderings={Object.values(PROJECT_ORDERINGS)}
          onChangeOrdering={handleChangeOrdering}
          onShowFilters={() => setIsShowingFilters(true)}
        />

        {hasProjects && (
          <CardList style={{ marginTop: '2rem' }}>
            {filteredProjects.map(project => (
              <S.Card key={project.id}>
                <S.LogoAndHeader>
                  <LogoWrapper>
                    <Logo
                      src={
                        project.pRep && project.pRep.logo
                          ? `https://images.weserv.nl/?url=${project.pRep.logo}`
                          : noLogo
                      }
                      alt={`${project.pRep.name} logo`}
                    />
                  </LogoWrapper>

                  <S.ProjectHeader>
                    <div style={{ minWidth: 0 }}>
                      <S.ProjectName>
                        <UnstyledLink to={`/projects/${project.slug}`}>{project.name}</UnstyledLink>
                      </S.ProjectName>
                      <Rating
                        overall={project.rating}
                        total={project.rating_count}
                        className="rating"
                      />
                    </div>
                    <Category category={project.category} className="md-show" />
                  </S.ProjectHeader>
                </S.LogoAndHeader>

                <S.Description>{project.description}</S.Description>

                <S.ProjectMetaMobile>
                  <Category category={project.category} />
                  {isRecentProject(project, RECENT_ACTIVITY_TYPES.CREATED) ? (
                    <S.ProjectRecent>
                      <S.Dot style={{ background: palette.beige }} />
                      <Text small>Recently created</Text>
                    </S.ProjectRecent>
                  ) : isRecentProject(project, RECENT_ACTIVITY_TYPES.UPDATED) ? (
                    <S.ProjectRecent>
                      <S.Dot style={{ background: palette.brand.primary }} />
                      <Text small>Recently updated</Text>
                    </S.ProjectRecent>
                  ) : null}
                </S.ProjectMetaMobile>

                <S.ProjectMeta>
                  <ProjectStatus status={project.status} />

                  <S.ProjectMetaSeparator />
                  <Completion completed={project.progress} />

                  <S.ProjectMetaSeparator className="md-show" />
                  <Text small style={{ flex: 1 }} className="md-show">
                    {format(new Date(project.start_date), DATE_FORMAT)}&nbsp;-&nbsp;
                    {format(new Date(project.end_date), DATE_FORMAT)}
                  </Text>

                  {isRecentProject(project, RECENT_ACTIVITY_TYPES.CREATED) ? (
                    <>
                      <S.ProjectMetaSeparator className="md-show" />
                      <S.ProjectRecent className="md-show">
                        <S.Dot style={{ background: palette.beige }} />
                        <Text small>Recently created</Text>
                      </S.ProjectRecent>
                    </>
                  ) : isRecentProject(project, RECENT_ACTIVITY_TYPES.UPDATED) ? (
                    <>
                      <S.ProjectMetaSeparator className="md-show" />
                      <S.ProjectRecent className="md-show">
                        <S.Dot style={{ background: palette.brand.primary }} />
                        <Text small>Recently updated</Text>
                      </S.ProjectRecent>
                    </>
                  ) : null}
                </S.ProjectMeta>
              </S.Card>
            ))}
          </CardList>
        )}

        {!hasProjects && isLoading && <Loading style={{ marginTop: '8rem' }} />}
        {hasProjects && !filteredProjects.length && (
          <S.MessageText>No projects found matching the search criteria.</S.MessageText>
        )}
      </S.Listing>
    </S.Container>
  );
}

ProjectList.propTypes = {
  title: PropTypes.string.isRequired,
  filtersToUse: PropTypes.shape({
    query: PropTypes.bool,
    category: PropTypes.bool,
    rating: PropTypes.bool,
    recent: PropTypes.bool,
    status: PropTypes.bool,
  }),
  additionalFilter: PropTypes.func,
};

export default ProjectList;
