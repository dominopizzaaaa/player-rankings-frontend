import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

const CustomNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

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
            {isAuthenticated && (
              <>
                <Link href="/matches" passHref legacyBehavior>
                  <Nav.Link>Matches</Nav.Link>
                </Link>
                <Link href="/tournaments" passHref legacyBehavior>
                  <Nav.Link>Tournaments</Nav.Link>
                </Link>
                <Link href="/manage-players" passHref legacyBehavior>
                  <Nav.Link>Add Player</Nav.Link>
                </Link>
                <Link href="/delete-players" passHref legacyBehavior>
                  <Nav.Link>Delete Players</Nav.Link>
                </Link>
                <Link href="/delete-matches" passHref legacyBehavior>
                  <Nav.Link>Delete Matches</Nav.Link>
                </Link>
                <Link href="/edit-players" passHref legacyBehavior>
                  <Nav.Link>Edit Players</Nav.Link>
                </Link>
                <Link href="/edit-matches" passHref legacyBehavior>
                  <Nav.Link>Edit Matches</Nav.Link>
                </Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
                  Logout
                </Nav.Link>
              </>
            )}
            {!isAuthenticated && (
              <Link href="/login" passHref legacyBehavior>
                <Nav.Link>Login</Nav.Link>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
