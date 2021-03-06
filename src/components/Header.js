import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoIconPReps from 'assets/logo-icon-preps.svg';
import Navigation from 'components/Navigation';
import { breakpoints, palette, sizes } from 'utils/designTokens';

const Container = styled.header`
  height: ${sizes.header}rem;
  background: ${palette.brand.primary};
  color: ${palette.white};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${sizes.header}rem;
  width: 100%;
  max-width: ${breakpoints.min.xl};
  padding: 0 2rem;
  margin: 0 auto;
`;

const Logo = styled.img`
  width: auto;
  height: 3.5rem;
`;

function Header() {
  return (
    <Container>
      <Inner>
        <Link to="/" style={{ display: 'inline-flex' }}>
          <Logo src={logoIconPReps} alt="ICON P-Reps logo" />
        </Link>
        <Navigation />
      </Inner>
    </Container>
  );
}

export default Header;
