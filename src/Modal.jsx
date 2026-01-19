import { useState } from 'react';
import axios from 'axios';
import CloseIcon from './assets/xmark-solid-full.svg';

const MAX_IMAGES = 5;

const MODAL_TITLE = {
  create: '新增產品',
  edit: '修改產品',
  delete: '刪除產品',
};

function Modal({ modalType, formData, setFormData, getProductList, setIsModalOpen, API_BASE, API_PATH }) {
  const [submitMessage, setSubmitMessage] = useState('');
  const handleFormChange = e => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  // API相關
  const handleCreate = async () => {
    try {
      const param = {
        data: {
          ...formData,
          origin_price: Number(formData.origin_price),
          price: Number(formData.price),
          is_enabled: formData.is_enabled ? 1 : 0,
          imagesUrl: formData.imagesUrl,
        },
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, param);
      closeModal();
      getProductList();
    } catch (error) {
      const message = error?.response?.data?.message.join(',');
      setSubmitMessage(message);
    }
  };

  const handleEdit = async () => {
    try {
      const id = formData.id;
      const param = {
        data: {
          ...formData,
          origin_price: Number(formData.origin_price),
          price: Number(formData.price),
          is_enabled: formData.is_enabled ? 1 : 0,
          imagesUrl: formData.imagesUrl,
        },
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${id}`, param);
      closeModal();
      getProductList();
    } catch (error) {
      const message = error?.response?.data?.message.join(',');
      setSubmitMessage(message);
    }
  };

  const handleDelete = async () => {
    try {
      const id = formData.id;
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      closeModal();
      getProductList();
    } catch (error) {
      const message = error?.response?.data?.message.join(',');
      setSubmitMessage(message);
    }
  };

  const addPic = () => {
    setFormData(prev => {
      if (prev.imagesUrl.length >= MAX_IMAGES) return prev;

      return {
        ...prev,
        imagesUrl: [...prev.imagesUrl, ''],
      };
    });
  };

  const deletePic = index => {
    setFormData(prev => {
      return {
        ...prev,
        imagesUrl: prev.imagesUrl.filter((_, i) => {
          return i !== index;
        }),
      };
    });
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value;

      return {
        ...prev,
        imagesUrl: newImages,
      };
    });
  };

  const handleConfirm = () => {
    const actions = {
      create: handleCreate,
      edit: handleEdit,
      delete: handleDelete,
    };

    actions[modalType]?.();
  };

  const closeModal = () => {
    setSubmitMessage('');
    setIsModalOpen(false);
  };

  return (
    <div className="modal" style={modalType === 'delete' ? { width: '300px' } : { width: '900px' }}>
      <img className="modal-close" src={CloseIcon} alt="close" onClick={closeModal} />
      <h3 className="modal-title"> {MODAL_TITLE[modalType] ?? '新增產品'}</h3>
      <div className="modal-content" style={modalType === 'delete' ? { height: '100px' } : {}}>
        {modalType === 'delete' ? (
          <div>確認要刪除此產品？</div>
        ) : (
          <>
            <div>
              <div className="modal-field">
                <label htmlFor="title">標題</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="description">描述</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  cols="35"
                  value={formData.description}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="content">說明</label>
                <textarea
                  id="content"
                  name="content"
                  rows="4"
                  cols="35"
                  value={formData.content}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="category">分類</label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="unit">單位</label>
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  value={formData.unit}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="origin_price">原價</label>
                <input
                  type="number"
                  name="origin_price"
                  id="origin_price"
                  min="0"
                  value={formData.origin_price}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="price">售價</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  value={formData.price}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                  required
                />
              </div>
              <div className="modal-field">
                <p>啟用</p>
                <div>
                  <input
                    type="checkbox"
                    id="is_enabled"
                    name="is_enabled"
                    checked={formData.is_enabled}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        is_enabled: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="is_enabled">是</label>
                </div>
              </div>
            </div>
            <div>
              <div className="modal-field">
                <label htmlFor="imageUrl">主圖網址</label>
                <input
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={e => {
                    handleFormChange(e);
                  }}
                  required
                />
              </div>
              <div className="modal-field">
                <p>其他圖片</p>
                <button type="button" disabled={formData.imagesUrl.length >= 5} onClick={addPic}>
                  增加
                </button>
                <p>(最多5張)</p>
              </div>
              {formData.imagesUrl &&
                formData.imagesUrl.length > 0 &&
                formData.imagesUrl.map((img, index) => {
                  return (
                    <div key={index} className="modal-field">
                      <label />
                      <input
                        type="text"
                        value={img}
                        onChange={e => {
                          handleImageChange(index, e.target.value);
                        }}
                      />
                      <button type="button" onClick={() => deletePic(index)}>
                        刪除
                      </button>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
      <div className="modal-footer">
        <p style={{ color: 'rgb(171, 15, 15)', fontSize: '14px' }}>
          {submitMessage !== '' ? `提示：${submitMessage}` : ''}
        </p>
        <div className="modal-btns">
          <button type="button" className="cancel" onClick={closeModal}>
            取消
          </button>
          <button type="button" className="confirm" onClick={handleConfirm}>
            {modalType === 'delete' ? '確認' : '送出'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
