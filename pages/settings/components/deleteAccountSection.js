import { useState } from "react";
import fire from "../../../config/fire-config";
import { Modal, Button } from "react-bootstrap";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ICONS from "components/icon/IconPaths";

const DeleteAccountSection = ({ userData }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
    setError("");

    // Track modal opening with mixpanel if needed
    try {
      mixpanel.init(mixpanelConfig);
      mixpanel.track("Delete Account Modal Opened");
    } catch (err) {
      console.error("Mixpanel error:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      await fire.auth().signOut();
      router.push("/users/login");
      toast("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error logging out");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError("");

    try {
      const user = fire.auth().currentUser;

      if (user) {
        // Delete the user account
        await user.delete();

        // Track successful deletion
        try {
          mixpanel.track("Account Deleted");
        } catch (err) {
          console.error("Mixpanel error:", err);
        }

        // Close modal
        setShowModal(false);

        // Show success message and redirect
        toast("Your account has been deleted");
        router.push("/");
      } else {
        setError("You need to be logged in to delete your account");
        setDeleting(false);
      }
    } catch (err) {
      setDeleting(false);

      // Handle common Firebase auth errors
      if (err.code === "auth/requires-recent-login") {
        setError(
          "For security reasons, you need to have recently logged in to perform this action. Please log out and log back in, then try again."
        );
      } else {
        setError(`Error deleting account: ${err.message}`);
      }

      console.error("Delete account error:", err);
    }
  };

  return (
    <div>
      <div className="card mx-auto">
        <div className="d-flex flex-column m-4" style={{ gap: "16px" }}>
          <div className="d-flex flex-column w-100 gap-4">
            <div className="d-flex flex-column gap-0">
              <h5 className="mb-1">Delete Account</h5>
              <p className="text-dark-low mb-0">
                This action in not reversible so make sure you're sure before
                continuing.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleShowModal}
                className="btn error medium small w-100 w-md-auto"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
        {!error ? (
          <div>
            <h3>Delete account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently delete all your data.
            </p>
            <div className="d-flex align-items-center justify-content-end flex-column flex-md-row w-100 gap-3 mt-5">
              <button
                type="button"
                className="btn dark medium w-100 w-md-auto order-1 order-md-0"
                onClick={handleCloseModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn error high w-100 w-md-auto order-0 order-md-1"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3>Need to reauthenticate</h3>
            <p>
              {error}
            </p>
            <div className="d-flex align-items-center justify-content-end flex-column flex-md-row w-100 gap-3 mt-5">
              <button
                type="button"
                className="btn dark medium w-100 w-md-auto order-1 order-md-0"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn primary high w-100 w-md-auto order-0 order-md-1"
                onClick={handleLogout}
                disabled={deleting}
              >
                {deleting ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </div>
        )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DeleteAccountSection;
