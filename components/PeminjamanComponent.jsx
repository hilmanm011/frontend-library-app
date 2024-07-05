/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment'
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';

import axios from 'axios';

const BASE_URL_PEMINJAMAN = `${import.meta.env.VITE_BASE_API}/peminjaman`;
const BASE_URL_BOOKS = `${import.meta.env.VITE_BASE_API}/books`;
const BASE_URL_MAHASISWA = `${import.meta.env.VITE_BASE_API}/mahasiswa`;

const PeminjamanComponent = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        pmj_mhs_id: '',
        pmj_tglpeminjaman: '',
        dtpeminjaman: [],
    });
    const [availableBooks, setAvailableBooks] = useState([]);
    const [availableMahasiswa, setAvailableMahasiswa] = useState([]);

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

    const handleAddBook = () => {
        const newDetail = {
            dpmj_buk_id: '',
        };
        setFormData({
            ...formData,
            dtpeminjaman: [...formData.dtpeminjaman, newDetail],
        });
    };

    const handleBookChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDtpeminjaman = [...formData.dtpeminjaman];
        updatedDtpeminjaman[index][name] = value;
        setFormData({
            ...formData,
            dtpeminjaman: updatedDtpeminjaman,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(BASE_URL_PEMINJAMAN, formData);
            setFormData({
                pmj_mhs_id: '',
                pmj_tglpeminjaman: '',
                dtpeminjaman: [],
            });
            getDataList();
            handleClose();
        } catch (error) {
            console.error('Error creating peminjaman:', error);
        }
    };

    const getDataList = async () => {
        try {
            const sfilterSearchParam = formSearch.sfilter_search ? `&sfilter_search=${formSearch.sfilter_search}` : '';
            const response = await axios.get(`${BASE_URL_PEMINJAMAN}?limit=${limit}&page=${currentPage}${sfilterSearchParam}`);
            setData(response.data.data);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error('Error fetching peminjaman:', error);
        }
    };

    const fetchAvailableBooks = async () => {
        try {
            // Fetch available books from API
            const response = await axios.get(`${BASE_URL_BOOKS}?limit=ALL`);
            setAvailableBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching available books:', error);
        }
    };

    const fetchAvailableMahasiswa = async () => {
        try {
            // Fetch available books from API
            const response = await axios.get(`${BASE_URL_MAHASISWA}?limit=ALL`);
            setAvailableMahasiswa(response.data.data);
        } catch (error) {
            console.error('Error fetching available mahasiswa:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleInputChangeSearch = (e) => {
        const { name, value } = e.target;
        setFormSeach({ ...formSearch, [name]: value });
    };

    useEffect(() => {
        getDataList();
        fetchAvailableBooks();
        fetchAvailableMahasiswa()
    }, [currentPage, formSearch]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <Button variant="primary" onClick={handleShow} className="mb-3">
                    Tambah Peminjaman
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
                        <th>NIM Mahasiswa</th>
                        <th>Nama Mahasiswa</th>
                        <th>Status</th>
                        <th>Tanggal Peminjaman</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.mhs_nim}</td>
                            <td>{item.mhs_nama}</td>
                            <td>
                                {item.pmj_statuspengembalian === 'Y' ? (
                                    <Badge bg="success">Selesai</Badge>
                                ) : (
                                    <Badge bg="warning">Dalam Peminjaman</Badge>
                                )}
                            </td>
                            <td>{moment(item.pmj_tglpeminjaman).format('DD MMMM YYYY')}</td>
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
                    <Modal.Title>Tambah Peminjaman Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formMhsId">
                            <Form.Label>Mahasiswa</Form.Label>
                            <Form.Control
                                as="select"
                                name="pmj_mhs_id"
                                value={formData.pmj_mhs_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Pilih Mahasiswa</option>
                                {availableMahasiswa.map((mhs) => (
                                    <option key={mhs.mhs_id} value={mhs.mhs_id}>
                                        {mhs.mhs_nim} - {mhs.mhs_nama}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formTglPeminjaman">
                            <Form.Label>Tanggal Peminjaman</Form.Label>
                            <Form.Control
                                type="date"
                                name="pmj_tglpeminjaman"
                                value={formData.pmj_tglpeminjaman}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        {formData.dtpeminjaman.map((detail, index) => (
                            <Form.Group key={index} controlId={`formBuku${index}`}>
                                <Form.Label>Buku {index + 1}</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="dpmj_buk_id"
                                    value={detail.dpmj_buk_id}
                                    onChange={(e) => handleBookChange(e, index)}
                                    required
                                >
                                    <option value="">Pilih Buku</option>
                                    {availableBooks.map((book) => (
                                        <option key={book.buk_id} value={book.buk_id}>
                                            {book.buk_judul}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        ))}
                        <Stack direction="horizontal" gap={3}>
                            <div className="p-2">
                            <Button
                                variant="outline-primary"
                                onClick={handleAddBook}
                                className="mb-3"
                            >
                                Tambah Buku
                            </Button>
                            </div>
                        </Stack>
                        
                        <Button variant="primary" type="submit">
                            Simpan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PeminjamanComponent;
