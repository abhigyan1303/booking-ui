import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/interceptor';
import '../scss/User.scss';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  userType: string[];
  mobile: string;
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/user/list?page=${currentPage}&pageSize=${pageSize}`);
        setUsers(response.data.users);
        setTotalData(response.data.totalData);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Token Expired');
          window.location.href = '/';
        } else {
          setError('Failed to fetch users');
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize]);

  const handleView = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      setSelectedUser(response.data);
      setIsViewPopupOpen(true);
    } catch (error) {
      alert('Failed to fetch user details');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditPopupOpen(true);
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/user/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleSave = async () => {
    if (selectedUser) {
      try {
        await axiosInstance.put(`/user/${selectedUser._id}`, selectedUser);
        setUsers(users.map(user => (user._id === selectedUser._id ? selectedUser : user)));
        setIsEditPopupOpen(false);
      } catch (error) {
        setServerError('Failed to save user details');
      }
    }
  };

  const handleAdd = async () => {
    if (selectedUser && password === confirmPassword) {
      try {
        const response = await axiosInstance.post('/user/create', { ...selectedUser, password });
        setUsers([...users, response.data]);
        setIsAddPopupOpen(false);
      } catch (error) {
        setServerError('Failed to add user');
      }
    } else {
      setServerError('Passwords do not match');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-management">
      <button className="add-user-button" onClick={() => setIsAddPopupOpen(true)}>
        <i className="fas fa-plus"></i> Add User
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.userType.join(', ')}</td>
              <td className="actions">
                <button className="view-button" onClick={() => handleView(user._id)}>View</button>
                <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(totalData / pageSize) }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {isViewPopupOpen && selectedUser && (
        <div className="view-popup">
          <div className="view-popup-content">
            <h2>View User</h2>
            <div className="form-grid">
              <label>
                First Name:
                <input type="text" value={selectedUser.firstName} readOnly />
              </label>
              <label>
                Last Name:
                <input type="text" value={selectedUser.lastName} readOnly />
              </label>
              <label>
                Email:
                <input type="email" value={selectedUser.email} readOnly />
              </label>
              <label>
                Username:
                <input type="text" value={selectedUser.username} readOnly />
              </label>
              <label>
                Mobile:
                <input type="text" value={selectedUser.mobile} readOnly />
              </label>
              <label>
                User Type:
                <input type="text" value={selectedUser.userType.join(', ')} readOnly />
              </label>
            </div>
            <button onClick={() => setIsViewPopupOpen(false)}>OK</button>
          </div>
        </div>
      )}
      {isEditPopupOpen && selectedUser && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h2>Edit User</h2>
            <div className="form-grid">
              <label>
                First Name:
                <input
                  type="text"
                  value={selectedUser.firstName}
                  onChange={e => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={selectedUser.lastName}
                  onChange={e => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={e => setSelectedUser({ ...selectedUser, username: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="text"
                  value={selectedUser.password}
                  onChange={e => setSelectedUser({ ...selectedUser, password: e.target.value })}
                />
              </label>
              <label>
                Mobile:
                <input
                  type="text"
                  value={selectedUser.mobile}
                  onChange={e => setSelectedUser({ ...selectedUser, mobile: e.target.value })}
                />
              </label>
              <label>
                User Type:
                <select
                  value={selectedUser.userType[0]}
                  onChange={e => setSelectedUser({ ...selectedUser, userType: [e.target.value] })}
                >
                  <option value="user">User</option>
                  <option value="superAdmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="travelAdmin">Travel Admin</option>
                </select>
              </label>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditPopupOpen(false)}>Cancel</button>
            {serverError && <p className="error">{serverError}</p>}
          </div>
        </div>
      )}
      {isAddPopupOpen && (
        <div className="add-popup">
          <div className="add-popup-content">
            <h2>Add User</h2>
            <div className="form-grid">
              <label>
                First Name:
                <input
                  type="text"
                  value={selectedUser?.firstName || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={selectedUser?.lastName || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  value={selectedUser?.username || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, username: e.target.value })}
                />
              </label>
              <label>
                Mobile:
                <input
                  type="text"
                  value={selectedUser?.mobile || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, mobile: e.target.value })}
                />
              </label>
              <label>
                User Type:
                <select
                  value={selectedUser?.userType[0] || 'user'}
                  onChange={e => setSelectedUser({ ...selectedUser, userType: [e.target.value] })}
                >
                  <option value="user">User</option>
                  <option value="superAdmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="travelAdmin">Travel Admin</option>
                </select>
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>
              <label>
                Confirm Password:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>
            <button onClick={handleAdd}>Add</button>
            <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
            {serverError && <p className="error">{serverError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default User;