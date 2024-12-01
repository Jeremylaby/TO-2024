import {Button} from "react-bootstrap";
import PropTypes from "prop-types";

const UserElement = ({user, fetchUsers}) => {
    const remove = async (id) => {
        await fetch(`api/user/${id}`, {
            method: "DELETE", headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Failed to delete user ");
            }
        }).then(() => {
            fetchUsers();
        })
            .catch((error) => {
                console.error("Error while deleting user:", error);
            });
    }
    return (
        <tr>
            <td style={{whiteSpace: 'nowrap'}}>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
            <td>
                {user.permissionLevel === 2
                    ? 'admin'
                    : user.permissionLevel === 1
                        ? 'worker'
                        : 'user'}
            </td>
            <td>
                <Button size="sm" variant="danger" onClick={() => remove(user.id)}
                        disabled={user.permissionLevel === 2}>Delete</Button>
            </td>
        </tr>
    );
};
UserElement.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        permissionLevel: PropTypes.number.isRequired,
    }).isRequired,
    fetchUsers:  PropTypes.func.isRequired
};
export default UserElement