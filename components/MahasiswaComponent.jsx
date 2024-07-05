/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge, Stack } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL_MAHASISWA = `${import.meta.env.VITE_BASE_API}/mahasiswa`;

const MahasiswaComponent = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        mhs_nama: '',
        mhs_nim: '',
        mhs_jurusan: '',
        mhs_tahunmasuk: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Number of items per page

    const [formSearch, setFormSeach] = useState({
        sfilter_search: '',
    })

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(BASE_URL_MAHASISWA, formData);
            setFormData({
                mhs_nama: '',
                mhs_nim: '',
                mhs_jurusan: '',
                mhs_tahunmasuk: ''
            });
            getDataList();
            handleClose();
        } catch (error) {
            console.error('Error creating mahasiswa:', error);
        }
    };

    const getDataList = async (page = 1) => {
        try {
            const sfilterSearchParam = formSearch.sfilter_search ? `&sfilter_search=${formSearch.sfilter_search}` : '';
            const response = await axios.get(`${BASE_URL_MAHASISWA}?limit=${limit}&page=${page}${sfilterSearchParam}`);
            setData(response.data.data);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChangeSearch = (e) => {
        const { name, value } = e.target;
        setFormSeach({ ...formSearch, [name]: value });
    };

    useEffect(() => {
        getDataList(currentPage);
    }, [currentPage, formSearch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            
            <div className="d-flex justify-content-between align-items-center">
                <Button variant="primary" onClick={handleShow} className='mb-3'>
                    Tambah Mahasiswa
                </Button>
                <div className='col-md-4'>
                    <Form.Control
                        type="text"
                        name="sfilter_search"
                        placeholder='Pencarian...'
                        value={formSearch.sfilter_search}
                        onChange={handleInputChangeSearch}
                        required
                    />
                </div>
            </div>

            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Jurusan</th>
                        <th>Tahun Masuk</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                            <td>{item.mhs_nama}</td>
                            <td>{item.mhs_nim}</td>
                            <td>{item.mhs_jurusan}</td>
                            <td>{item.mhs_tahunmasuk}</td>
                            <td>
                                {item.mhs_isactive === 'Y' ? (
                                    <Badge bg="success">Active</Badge>
                                ) : (
                                    <Badge bg="danger">Inactive</Badge>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="pagination d-flex justify-content-end">

            <Stack direction="horizontal" gap={3}>
                <div className="p-2">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                </div>
                <div className="p-2">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
                <div className="p-2">
                    <span className="ml-3">Page {currentPage} of {totalPages}</span>
                </div>
            </Stack>
                
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Mahasiswa Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                name="mhs_nama"
                                value={formData.mhs_nama}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNIM">
                            <Form.Label>NIM</Form.Label>
                            <Form.Control
                                type="text"
                                name="mhs_nim"
                                value={formData.mhs_nim}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formJurusan">
                            <Form.Label>Jurusan</Form.Label>
                            <Form.Control
                                type="text"
                                name="mhs_jurusan"
                                value={formData.mhs_jurusan}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTahunMasuk">
                            <Form.Label>Tahun Masuk</Form.Label>
                            <Form.Control
                                type="number"
                                name="mhs_tahunmasuk"
                                value={formData.mhs_tahunmasuk}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className='mt-3'>
                            Simpan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MahasiswaComponent;
