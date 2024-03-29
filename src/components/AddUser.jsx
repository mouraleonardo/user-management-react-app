'use cliente';
import React, { useState } from "react";
import axios from "axios";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import { API_URL } from '../constants';

const UserForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({}); // Clear previous validation errors when the user changes the input
  };

  const handleSubmit = () => {
    // Validate form inputs
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Perform API request to create a new user
    axios
      .post(API_URL, {
        action: "createUser",
        ...formData,
      })
      .then((response) => {
        onUserAdded(response.data);
        setShowSuccessAlert(true); // Show success message
        onClose(); // Close the modal
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrors({ general: error.response.data.error });
        } else {
          console.error("Error creating user:", error);
          setErrors({ general: "An unexpected error occurred." });
        }
      });
  };

  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, username, email, password } = formData;

    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // Validate username
    if (!username.trim()) {
      errors.username = "Username is required";
    }

    // Validate email
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }

    // Validate password
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.trim().length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      {showSuccessAlert && (
        <Alert color="success">User added successfully!</Alert>
      )}
      {errors.general && <div style={{ color: "red" }}>{errors.general}</div>}
      <Label htmlFor="firstName" value="First Name" />
      <TextInput
        type="text"
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
      />
      {errors.firstName && (
        <div style={{ color: "red" }}>{errors.firstName}</div>
      )}

      <Label htmlFor="lastName" value="Last Name" />
      <TextInput
        type="text"
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
      />
      {errors.lastName && <div style={{ color: "red" }}>{errors.lastName}</div>}

      <Label htmlFor="username" value="Username" />
      <TextInput
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
      {errors.username && <div style={{ color: "red" }}>{errors.username}</div>}

      <Label htmlFor="email" value="Email" />
      <TextInput
        type="text"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}

      <Label htmlFor="password" value="Password" />
      <TextInput
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />
      {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="col-span-full md:col-span-1 flex justify-between">
          <Button type="submit" onClick={handleSubmit}>
            Add User
          </Button>
          <Button type="button" color="gray" onClick={onClose}>
            Cancel
          </Button>{" "}
          {/* Fixed onClick handler */}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
