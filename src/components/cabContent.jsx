import React, { useEffect, useState } from 'react';
import { BiPencil } from 'react-icons/bi';
import '../styles/cabContent.css';
import CabHeader from './CabHeader';
import EditCabangModal from './cabEdit';
import axios from 'axios';

const CabContent = () => {
  const [cabangData, setCabangData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cabangToEdit, setCabangToEdit] = useState(null);

  // Fetch semua cabang dari backend
  const fetchCabangData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cabang');
      const formatted = res.data.map(c => ({
        id: c.id_cabang,
        namaCabang: c.nama_cabang,
        alamatCabang: c.alamat_cabang
      }));
      setCabangData(formatted);
    } catch (err) {
      console.error('Gagal fetch data cabang:', err);
    }
  };

  useEffect(() => {
    fetchCabangData();
  }, []);

  // Tambah cabang ke backend
  const handleAddCabang = async (newCabang) => {
    try {
      await axios.post('http://localhost:5000/api/cabang', newCabang), {
        nama_cabang: newCabang.namaCabang,
        alamat_cabang: newCabang.alamatCabang
      };
      fetchCabangData();
    } catch (err) {
      console.error('Gagal tambah cabang:', err);
    }
  };

  // Edit cabang
  const handleUpdateCabang = async (updatedCabang) => {
    try {
      await axios.put(`http://localhost:5000/api/cabang/${updatedCabang.id}`, {
        nama_cabang: updatedCabang.namaCabang,
        alamat_cabang: updatedCabang.alamatCabang
      });
      fetchCabangData();
      handleCloseEditModal();
    } catch (err) {
      console.error('Gagal update cabang:', err);
    }
  };

  const handleOpenEditModal = (cabang) => {
    setCabangToEdit(cabang);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCabangToEdit(null);
  };

  return (
    <>
      <CabHeader onAddCabang={handleAddCabang} />

      <div className="cab-content">
        <div className="cabang-table-container">
          <table className="cabang-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Cabang</th>
                <th>Alamat Cabang</th>
                <th>Custom</th>
              </tr>
            </thead>
            <tbody>
              {cabangData.map((cabang) => (
                <tr key={cabang.id}>
                  <td>{cabang.id}</td>
                  <td>{cabang.namaCabang}</td>
                  <td>{cabang.alamatCabang}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleOpenEditModal(cabang)}
                    >
                      <BiPencil className="edit-icon" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditCabangModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        cabangData={cabangToEdit}
        onUpdateCabang={handleUpdateCabang}
      />
    </>
  );
};

export default CabContent;
