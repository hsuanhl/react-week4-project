import { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/reset.scss';
import './assets/style.scss';
import loading from './assets/Loading_icon.gif';
import Modal from './Modal';
import Login from './Login';
import Pager from './Pager';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const FORM_TEMPLATE = {
  title: '',
  category: '',
  unit: '',
  description: '',
  content: '',
  origin_price: '',
  price: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: [],
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [modalType, setModalType] = useState('create');

  const [productList, setProductList] = useState([]);

  // 列表相關
  const [formData, setFormData] = useState(FORM_TEMPLATE);
  // pagination
  const [pager, setPager] = useState({
    category: '',
    current_page: 1,
    has_next: true,
    has_pre: false,
    total_pages: 1,
  });

  const getProductList = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${pager.current_page}`);
      setProductList(response.data.products);
      setPager(response.data.pagination);
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setIsFetching(false);
    }
  };

  const checkStatus = async () => {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      if (!token) {
        setIsAuth(false);
        return;
      }
      axios.defaults.headers.common['Authorization'] = token;
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log(error?.response?.data?.message);
    }
  };

  // modal 相關
  const openModal = (type, product = {}) => {
    setFormData({
      title: product.title || '',
      category: product.category || '',
      unit: product.unit || '',
      description: product.description || '',
      content: product.content || '',
      origin_price: product.origin_price || '',
      price: product.price || '',
      is_enabled: product.is_enabled || false,
      imageUrl: product.imageUrl || '',
      imagesUrl: product.imagesUrl || [],
      id: product.id || '',
    });
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    getProductList();
  }, [pager.current_page, isAuth]);

  return (
    <>
      {isAuth ? (
        <div className="product-content">
          <button className="btn btn-primary product-button" type="button" onClick={() => openModal('create', {})}>
            新增產品
          </button>
          <table className="product-table">
            <thead>
              <tr>
                <th></th>
                <th>類別</th>
                <th>名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>預覽</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan="8"><img src={loading} alt="loading" /></td>
                </tr>
              ) : productList && productList.length > 0 ? (
                productList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(pager.current_page - 1) * 10 + index + 1}</td>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td className="align-right">{item.origin_price.toLocaleString()}</td>
                    <td className="align-right">{item.price.toLocaleString()}</td>
                    <td className={item.is_enabled ? 'activate' : 'unactivate'}>
                      {item.is_enabled ? '已啟用' : '未啟用'}
                    </td>
                    <td className="table-img">
                      <img src={item.imageUrl} alt="preview" />
                    </td>
                    <td>
                      <button className="table-btn edit" type="button" onClick={() => openModal('edit', item)}>
                        編輯
                      </button>
                      <button className="table-btn delete" type="button" onClick={() => openModal('delete', item)}>
                        刪除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">資料載入中...</td>
                </tr>
              )}
            </tbody>
          </table>
          {pager.total_pages > 1 && <Pager pager={pager} setPager={setPager} />}
        </div>
      ) : (
        <Login API_BASE={API_BASE} setIsAuth={setIsAuth} getProductList={getProductList} />
      )}
      {isModalOpen && (
        <Modal
          API_PATH={API_PATH}
          API_BASE={API_BASE}
          modalType={modalType}
          formData={formData}
          setFormData={setFormData}
          getProductList={getProductList}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}

export default App;
