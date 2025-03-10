import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">🏓 Elo Rankings</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link>Leaderboard</Nav.Link>
            </Link>
            <Link href="/matches" passHref legacyBehavior>
              <Nav.Link>Matches</Nav.Link>
            </Link>
            <Link href="/manage-players" passHref legacyBehavior>
              <Nav.Link>Add Player</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
