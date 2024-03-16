'use cliente';
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import UserForm from "./AddUser";
import EditUserForm from "./EditUser";
import {
  TextInput,
  Button,
  Modal,
  Pagination,
  Table,
  Alert,
} from "flowbite-react";
import {
  HiOutlineSearch,
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import { API_URL } from '../constants';

const UserList = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessageStatus, setAlertMessageStatus] = useState(false);
  const [alertMessageColor, setAlertMessageColor] = useState("success"); // Default color is green
  const [editUserId, setEditUserId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchUsers = useCallback(() => {
    axios
      .post(API_URL, { action: "listUsers" })
      .then((response) => {
        // Sorting users array based on IDs before setting state
        const sortedUsers = response.data.sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
        updateTotalPages(sortedUsers.length);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []); // No dependencies here because it doesn't rely on external variables

  useEffect(
    () => {
      fetchUsers();
      if (searchTerm) {
        fetchUsers();
        setCurrentPage(1); // Reset currentPage to 1
      }
    },
    [fetchUsers, searchTerm]
  ); // Only fetchUsers is listed as dependency

  const handleSearch = () => {
    // If search term is empty, fetch original user list
    if (searchTerm === "") {
      fetchUsers();
      setSearchTerm(""); // Ensure searchTeclsrm state is cleared
      setCurrentPage(1); // Reset currentPage to 1
    } else {
      axios
        .post(API_URL, {
          action: "getUser",
          searchTerm,
        })
        .then((response) => {
          const searchedUsers = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setUsers(searchedUsers);
          updateTotalPages(searchedUsers.length);
          setCurrentPage(1); // Reset currentPage to 1 after search
        })
        .catch((error) => console.error("Error searching users:", error));
    }
  };

  const updateTotalPages = (totalUsers) => {
    setTotalPages(Math.ceil(totalUsers / 5)); // Assuming 5 users per page
  };

  const handleShowForm = () => {
    setOpenModal(true);
  };

  const handleCloseForm = () => {
    setOpenModal(false);
  };

  // Function to open edit modal with user details
  const handleEditUser = (userId) => {
    setEditUserId(userId);
    setOpenEditModal(true);
  };

  // Function to close edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  // Function to update user details after edit
  // Function to handle updating a user
  const handleUserUpdated = (updatedUser) => {
    // Update the user in the list
    const userUpdated = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(userUpdated);
    fetchUsers();
    setAlertMessageStatus(true); // Show update alert
    setAlertMessageColor("success"); // Set alert color to green
    setTimeout(() => setAlertMessageStatus(false), 3000); // Hide alert after 3 seconds
  };

  // Function to handle adding a new user
  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
    fetchUsers();
    setSearchTerm("");
    setAlertMessageColor("success"); // Set alert color to red
    setAlertMessageStatus(true); // Show deletion alert
    setTimeout(() => setAlertMessageStatus(false), 3000); // Hide alert after 3 seconds
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle deleting a user
  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setShowAlert(true); // Show deletion alert
  };

  const confirmDeleteUser = () => {
    axios
      .post(API_URL, {
        action: "deleteUser",
        userId: deleteUserId,
      })
      .then((response) => {
        fetchUsers(); // Refresh the user list after deletion
        setShowAlert(false); // Close the alert modal
        setAlertMessageColor("warning"); // Set alert color to red
        setAlertMessageStatus(true); // Show deletion alert
        setTimeout(() => setAlertMessageStatus(false), 3000); // Hide alert after 3 seconds
        // Other deletion logic...
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <>
      {/* Alert for user addition or deletion */}
      {alertMessageStatus && (
        <Alert
        color={alertMessageColor}
        className={alertMessageColor === "warning" ? "withBorderAccent" : "rounded"}
      >
        {deleteUserId ? "User deleted successfully!"
          : editUserId
            ? "User updated successfully!"
            : "User added successfully!"}
      </Alert>
      )}
      <div className="flex justify-between items-center mb-3">
        <Button onClick={handleShowForm}>
          <HiOutlinePlusCircle className="mr-4 h-5 w-5" />
          Add User
        </Button>
        <Modal show={openModal} onClose={handleCloseForm}>
          <Modal.Header>Add a New User</Modal.Header>
          <Modal.Body>
            <UserForm onClose={handleCloseForm} onUserAdded={handleUserAdded} />
          </Modal.Body>
        </Modal>
        <div className="flex items-center">
          <TextInput
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Update searchTerm state
              if (e.target.value === "") {
                // If search input is empty, fetch original user list
                fetchUsers();
                setCurrentPage(1); // Reset currentPage to 1
              }
            }}
            className="px-4 py-2"
          />
          <Button color="blue" onClick={handleSearch}>
            <HiOutlineSearch className="mr-4 h-5 w-5" /> Search
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Last Name</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {users
            .slice((currentPage - 1) * 5, currentPage * 5)
            .map((user, index) => (
              <Table.Row key={user.id || index}>
                <Table.Cell>{user.first_name || "N/A"}</Table.Cell>
                <Table.Cell>{user.last_name || "N/A"}</Table.Cell>
                <Table.Cell>{user.username || "N/A"}</Table.Cell>
                <Table.Cell>{user.email || "N/A"}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-between items-center max-w-[30px] ml-10 gap-1">
                    <Button
                      color="purple"
                      className="w-6 h-6"
                      onClick={() => handleEditUser(user.id)}
                    >
                      <HiOutlinePencilAlt />
                    </Button>
                    <Button
                      color="failure"
                      className="w-6 h-6"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <HiOutlineTrash />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <Modal show={openEditModal} onClose={handleCloseEditModal}>
        <Modal.Header>Edit a User</Modal.Header>
        <Modal.Body>
          <EditUserForm
            userData={users.find((user) => user.id === editUserId)} // Change 'user' to 'userData'
            onClose={handleCloseEditModal}
            onUserUpdated={handleUserUpdated}
          />
        </Modal.Body>
      </Modal>
      </div>
      <div className="flex overflow-x-auto sm:justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal show={showAlert} onClose={() => setShowAlert(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button color="danger" onClick={confirmDeleteUser}>
            Yes
          </Button>
          <Button onClick={() => setShowAlert(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Add prop validation using PropTypes
UserList.propTypes = {
  users: PropTypes.array.isRequired, // Ensure users prop is an array and required
};

export default UserList;
