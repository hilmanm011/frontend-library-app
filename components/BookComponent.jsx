/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Stack } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL_BOOK = `${import.meta.env.VITE_BASE_API}/books`;

const BookComponent = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        buk_judul: '',
        buk_pengarang: '',
        buk_penerbit: '',
        buk_tahunterbit: '',
        buk_isbn: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Number of items per page

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(BASE_URL_BOOK, formData);
            setFormData({
                buk_judul: '',
                buk_pengarang: '',
                buk_penerbit: '',
                buk_tahunterbit: '',
                buk_isbn: '',
            });
            getDataList();
            handleClose();
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    const getDataList = async () => {
        try {
            const response = await axios.get(`${BASE_URL_BOOK}?limit=${limit}&page=${currentPage}`);
            setData(response.data.data);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getDataList();
    }, [currentPage]); // Fetch data when currentPage changes

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="mb-3">
                Tambah Buku
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Judul</th>
                        <th>Pengarang</th>
                        <th>Penerbit</th>
                        <th>Tahun Terbit</th>
                        <th>ISBN</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * limit + index + 1}</td> {/* Calculate row number */}
                            <td>{item.buk_judul}</td>
                            <td>{item.buk_pengarang}</td>
                            <td>{item.buk_penerbit}</td>
                            <td>{item.buk_tahunterbit}</td>
                            <td>{item.buk_isbn}</td>
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
                <Modal.Title>Tambah Buku Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formJudul">
                    <Form.Label>Judul</Form.Label>
                    <Form.Control
                        type="text"
                        name="buk_judul"
                        value={formData.buk_judul}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="formPengarang">
                    <Form.Label>Pengarang</Form.Label>
                    <Form.Control
                        type="text"
                        name="buk_pengarang"
                        value={formData.buk_pengarang}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="formPenerbit">
                    <Form.Label>Penerbit</Form.Label>
                    <Form.Control
                        type="text"
                        name="buk_penerbit"
                        value={formData.buk_penerbit}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="formTahunterbit">
                    <Form.Label>Tahun</Form.Label>
                    <Form.Control
                        type="number"
                        name="buk_tahunterbit"
                        value={formData.buk_tahunterbit}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="formISBN">
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control
                        type="text"
                        name="buk_isbn"
                        value={formData.buk_isbn}
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

export default BookComponent;
