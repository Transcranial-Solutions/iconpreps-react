import React, { createContext, useContext, useEffect, useState } from 'react';
import { pick } from 'lodash-es';
import PropTypes from 'prop-types';
import { usePReps } from 'components/PReps';
import * as feedbackApi from 'utils/feedbackApi';
import * as projectsApi from 'utils/projectsApi';

const INITIAL_STATE = {
  getFilters: null,
  getProjects: null,
  hasFilters: false,
  hasProjects: false,
  isLoading: true,
};

export const ProjectsContext = createContext(INITIAL_STATE);

export function useProjects() {
  return useContext(ProjectsContext);
}

function Projects({ children }) {
  const { getPReps, hasPReps } = usePReps();
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(INITIAL_STATE.isLoading);
  const [hasProjects, setHasProjects] = useState(INITIAL_STATE.hasProjects);
  const [hasFilters, setHasFilters] = useState(INITIAL_STATE.hasFilters);

  useEffect(() => {
    if (hasPReps) loadProjects();
  }, [hasPReps]); // eslint-disable-line

  useEffect(() => void loadFilters(), []);

  async function loadProjects() {
    const [projects, ratings] = await Promise.all([
      projectsApi.getAllProjects(),
      feedbackApi.getAllRatings(),
    ]);

    const pReps = getPReps();
    setProjects(
      projects.map(project => {
        let rating = ratings.find(rating => rating.project_id === project.id);
        if (rating) rating = pick(rating, ['rating', 'rating_count']);
        else rating = { rating: 0, rating_count: 0 };

        const pRep = pReps.find(pRep => pRep.address === project.prep_address) || null;

        return { ...project, ...rating, pRep };
      })
    );

    setIsLoading(false);
    setHasProjects(true);
  }

  async function loadFilters() {
    const filters = await projectsApi.getFilters();
    setFilters(filters);
    setHasFilters(true);
  }

  function getProjects() {
    return projects;
  }

  function getFilters() {
    return filters;
  }

  return (
    <ProjectsContext.Provider
      value={{ getFilters, getProjects, hasFilters, hasProjects, isLoading }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

Projects.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Projects;
