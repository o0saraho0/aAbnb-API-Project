const ConfirmDeleteModal = ({ onDelete, onClose }) => (
    <div className="confirm_deletion">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <button id="red_button" onClick={onDelete}>Yes (Delete Spot)</button>
      <button className="dark_grey_button" onClick={onClose}>No (Keep Spot)</button>
    </div>
  );
  
  export default ConfirmDeleteModal;

 
  