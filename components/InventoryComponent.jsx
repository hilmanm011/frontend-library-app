/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Stack } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL_INVENTORY = `${import.meta.env.VITE_BASE_API}/inventory`;
const BASE_URL_BUKU = `${import.meta.env.VITE_BASE_API}/books`;

const InventoryComponent = () => {
    const [data, setData] = useState([]);
    const [bukuData, setBukuData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        inv_lokasi: '',
        inv_rak: '',
        inv_buk_id: '',
        inv_jumlah: '',
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
            await axios.post(BASE_URL_INVENTORY, formData);
            setFormData({
                inv_lokasi: '',
                inv_rak: '',
                inv_buk_id: '',
                inv_jumlah: '',
            });
            getDataList();
            handleClose();
        } catch (error) {
            console.error('Error creating inventory:', error);
        }
    };

    const getDataList = async () => {
        const sfilterSearchParam = formSearch.sfilter_search ? `&sfilter_search=${formSearch.sfilter_search}` : '';
        const response = await axios.get(`${BASE_URL_INVENTORY}?limit=${limit}&page=${currentPage}${sfilterSearchParam}`);
        setTotalPages(Math.ceil(response.data.total / limit));
        setData(response.data.data);
    };

    const getBukuList = async () => {
        const response = await axios.get(`${BASE_URL_BUKU}?limit=ALL`);
        setBukuData(response.data.data);
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
        getBukuList();
    }, [currentPage, formSearch]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <Button variant="primary" onClick={handleShow} className='mb-3'>
                    Tambah Inventory
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
                        <th>Lokasi</th>
                        <th>Rak</th>
                        <th>Buku</th>
                        <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.inv_lokasi}</td>
                            <td>{item.inv_rak}</td>
                            <td>{item.buk_judul}</td>
                            <td>{item.inv_jumlah}</td>
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
                    <Modal.Title>Tambah Inventory Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formLokasi">
                            <Form.Label>Lokasi</Form.Label>
                            <Form.Control
                                type="text"
                                name="inv_lokasi"
                                value={formData.inv_lokasi}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRak">
                            <Form.Label>Rak</Form.Label>
                            <Form.Control
                                type="text"
                                name="inv_rak"
                                value={formData.inv_rak}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBuku">
                            <Form.Label>Buku</Form.Label>
                            <Form.Control
                                as="select"
                                name="inv_buk_id"
                                value={formData.inv_buk_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Pilih Buku</option>
                                {bukuData.map((buku) => (
                                    <option key={buku.buk_id} value={buku.buk_id}>
                                        {buku.buk_judul}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formJumlah">
                            <Form.Label>Jumlah</Form.Label>
                            <Form.Control
                                type="number"
                                name="inv_jumlah"
                                value={formData.inv_jumlah}
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

export default InventoryComponent;
