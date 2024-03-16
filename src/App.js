import React, { useState } from "react";
import UserList from "./components/Users";
import { Navbar, Avatar, Dropdown, Footer } from "flowbite-react";
import Logo from "./assets/logo.svg";
import LeoMoura from "./assets/LeoMoura.jpg";
import { BsGithub } from "react-icons/bs";
import { GrCodepen } from "react-icons/gr";
import { FaLinkedin } from "react-icons/fa";
import { Tooltip } from 'flowbite-react';

const App = () => {
  const [users, setUsers] = useState([]);

  // eslint-disable-next-line
  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <>
      <Navbar fluid rounded className="bg-gray-100">
        <Navbar.Brand className="flex justify-between items-center">
          <img
            src={Logo}
            className="mr-1 h-12"
            alt="User Management React App"
          />
          <h1 className="text-3xl font-bold">User Management App</h1>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="Leonardo Moura Contact" img={LeoMoura} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Leonardo Moura</span>
              <span className="block truncate text-sm font-medium">
                contact@mouraleonardo.com
              </span>
            </Dropdown.Header>
          </Dropdown>
          <Navbar.Toggle />
        </div>
      </Navbar>
      <main className="container mx-auto mt-8">
        <UserList users={users} />
      </main>
      <Footer container className="container mx-auto">
        <div className="w-full">
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Tooltip content="Portifolio" placement="bottom" animation="duration-500">
            <Footer.Copyright
              href="https://mouraleonardo.com"
              by="Leonardo Moura™"
              year={2024}
            />
            </Tooltip>
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Tooltip content="GitHub" className="tooltip" placement="bottom" animation="duration-500">
                <Footer.Icon
                  href="https://github.com/mouraleonardo"
                  icon={BsGithub}
                  label="GitHub"
                />
              </Tooltip>
              <Tooltip content="CodePen" className="tooltip" placement="bottom" animation="duration-500">
                <Footer.Icon
                  href="https://codepen.io/mouraleonardo"
                  icon={GrCodepen}
                  label="CodePen"
                />
              </Tooltip>
              <Tooltip content="LinkedIn" className="tooltip" placement="bottom" animation="duration-500">
                <Footer.Icon
                  href="https://www.linkedin.com/in/mouraleonardo/"
                  icon={FaLinkedin}
                  label="LinkedIn"
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </Footer>
    </>
  );
};

export default App;
