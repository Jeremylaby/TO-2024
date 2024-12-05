import {Button, TableCell, TableRow} from "@mui/material";
import PropTypes from "prop-types";

const UserElement = ({ user, fetchUsers }) => {
  const remove = async (user) => {
    await fetch(`/api/user/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user ");
        }
      })
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error while deleting user:", error);
      });
  };
  return (
      <TableRow>
          <TableCell sx={{ whiteSpace: "nowrap" }}>{user.id}</TableCell>
          <TableCell>{user.firstName}</TableCell>
          <TableCell>{user.lastName}</TableCell>
          <TableCell>{user.email}</TableCell>

          <TableCell>
              <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => remove(user)}
              >
                  Delete
              </Button>
          </TableCell>
      </TableRow>
  );
};
UserElement.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  fetchUsers: PropTypes.func.isRequired,
};
export default UserElement;
