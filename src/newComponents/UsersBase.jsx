import React, { useEffect, useState, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Icon from 'react-crud-icons';
import 'react-crud-icons/dist/css/react-crud-icons.css';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../helpers/AuthContext';

function UsersBase() {
  const { authState, logOut } = useContext(AuthContext);

  const [usersList, setUsersList] = useState([]);
  const [masterCheck, setMasterCheck] = useState(false);

  const userEmail = authState.email;

  const getMasterCheck = () => {
    setMasterCheck(!masterCheck);
    const newList = usersList.map((user) => ({ ...user, selected: !masterCheck }));
    setUsersList(newList);
  };

  const getSelect = (id) => {
    const updatedUSers = usersList.map((user) => {
      if (user.id === id) {
        user.selected = !user.selected;
      }
      return user;
    });
    setUsersList(updatedUSers);
  };

  const blocking = async () => {
    const usersToBlock = usersList.filter((user) => user.selected === true);
    const ids = usersToBlock.map((user) => user.id);
    const response = await axios.patch(`http://localhost:3001/users/blocking/${userEmail}`, { ids });
    if (response.data.error) {
      logOut();
      return;
    }
    const updatedUSers = usersList.map((user) => {
      if (ids.includes(user.id)) {
        user.status = 'Blocked';
      }
      user.selected = false;
      return user;
    });
    setMasterCheck(false);
    setUsersList(updatedUSers);
    if (ids.includes(authState.id)) {
      logOut();
    }
  };

  const unblocking = async () => {
    const usersToBlock = usersList.filter((user) => user.selected === true);
    const ids = usersToBlock.map((user) => user.id);
    const response = await axios.patch(`http://localhost:3001/users/unblocking/${userEmail}`, { ids });
    if (response.data.error) {
      logOut();
      return;
    }
    const updatedUSers = usersList.map((user) => {
      if (ids.includes(user.id)) {
        user.status = 'Unlocked';
      }
      user.selected = false;
      return user;
    });
    setMasterCheck(false);
    setUsersList(updatedUSers);
  };

  const deleteUsers = async () => {
    const usersToDelete = usersList.filter((user) => user.selected === true);
    const ids = usersToDelete.map((user) => user.id);
    const response = await axios.patch(`http://localhost:3001/users/destroy/${userEmail}`, { ids });
    if (response.data.error) {
      logOut();
      return;
    }
    const updatedUSers = usersList.filter((user) => !ids.includes(user.id));
    setMasterCheck(false);
    setUsersList(updatedUSers);
    if (ids.includes(authState.id)) {
      logOut();
    }
  };

  useEffect(() => {
    const getResponse = async () => {
      const response = await axios.get(`http://localhost:3001/users/${userEmail}`);
      if (response.data.error) {
        logOut();
        return;
      }
      const readyList = response.data.map((user) => ({ ...user, selected: masterCheck }));
      setUsersList(readyList);
    };
    getResponse();
  }, [logOut, masterCheck, userEmail]);

  return (
    <div className="usersBase">
      <div className="toolbar">
        <Icon
          name="lock"
          tooltip="Blocking"
          theme="light"
          size="medium"
          onClick={() => { blocking(); }}
        />
        <Icon
          name="lock-open"
          tooltip="Lock-open"
          theme="light"
          size="medium"
          onClick={() => { unblocking(); }}
        />
        <Icon
          name="remove"
          tooltip="Remove"
          theme="light"
          size="medium"
          onClick={() => { deleteUsers(); }}
        />
        <Button className="logoutbtn" variant="danger" onClick={() => { logOut(); }}>
          {authState.email}
          <Icon
            name="account"
            theme="light"
            size="medium"
          />
          Log Out
        </Button>
      </div>

      <Table striped hover variant="dark">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={masterCheck}
                id="mastercheck"
                onChange={() => getMasterCheck()}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Registration date</th>
            <th>Last login date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {usersList.map(({
            id, name, email, lastLoginTime, createdAt, status, selected,
          }) => {
            const date = new Date(createdAt).toDateString();
            return (
              <tr key={id}>
                <th scope="row">
                  <input
                    type="checkbox"
                    checked={selected}
                    id="rowcheck{user.id}"
                    onChange={() => { getSelect(id); }}
                  />
                </th>
                <td>{id}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{date}</td>
                <td>{lastLoginTime}</td>
                <td className={status === 'Unlocked' ? 'unlocked' : 'blocked'}>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default UsersBase;
