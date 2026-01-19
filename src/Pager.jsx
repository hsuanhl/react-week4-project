function Pager({pager, setPager}){
    const switchPage = pageNum => {
      setPager(prev => ({
        ...prev,
        current_page: pageNum,
      }));
    };
  
    const upPage = () => {
      setPager(prev => ({
        ...prev,
        current_page: prev.current_page + 1,
      }));
    };
  
    const downPage = () => {
      setPager(prev => ({
        ...prev,
        current_page: prev.current_page - 1,
      }));
    };
  return(<>
   <ul className="pagination">
              <li>
                <a className={pager.has_pre ? '' : 'disabled'} href="#" onClick={downPage}>
                  &laquo;
                </a>
              </li>
              {Array.from({ length: pager.total_pages }, (v, i) => i + 1).map((num, index) => {
                return (
                  <li key={index}>
                    <a href="#" className={pager.current_page === num ? 'active' : ''} onClick={() => switchPage(num)}>
                      {num}
                    </a>
                  </li>
                );
              })}
              <li>
                <a className={pager.has_next ? '' : 'disabled'} href="#" onClick={upPage}>
                  &raquo;
                </a>
              </li>
            </ul>
  </>)
}

export default Pager