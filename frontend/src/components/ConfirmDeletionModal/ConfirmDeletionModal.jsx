import './ConfirmDeletionModal.css'


const ConfirmDeleteModal = ({ onDelete, onClose }) => (
    <div className="confirm-delete-modal-content">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <button id="red-button" onClick={onDelete}>Yes (Delete Spot)</button>
      <button className="dark-grey-button" onClick={onClose}>No (Keep Spot)</button>
    </div>
  );
  
  export default ConfirmDeleteModal;

 
  