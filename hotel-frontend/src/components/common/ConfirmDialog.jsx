const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmStyle = 'danger' }) => {
  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    let className = 'btn';
    if (confirmStyle === 'danger') {
      className += ' btn-danger';
    } else if (confirmStyle === 'success') {
      className += ' btn-success';
    }
    return className;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p className="error-message" style={{margin: 0}}>{message}</p>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #eee'}}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className={getConfirmButtonClass()}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;