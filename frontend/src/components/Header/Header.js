import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logout, deleteUserAccount } from "../../actions/userActions";

const Header = ({ setSearch }) => {
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/");
  };

  const deleteAccountHandler = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      dispatch(deleteUserAccount());
      history.push("/");
    }
  };

  return (
    <Navbar
      bg="primary"
      expand="lg"
      variant="dark"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand href="/">Note Vault</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="m-auto">
            <Form className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Nav>
          {userInfo ? (
            <Nav style={{ maxHeight: "100px" }} navbarScroll>
              <Nav.Link href="/mynotes">My Notes</Nav.Link>
              <NavDropdown title={userInfo?.name} id="navbarScrollingDropdown">
                <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={deleteAccountHandler}>
                  Delete Account
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
