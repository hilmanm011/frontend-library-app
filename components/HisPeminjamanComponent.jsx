/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, Form, Stack, Table } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL_HISTORY_PEMINJAMAN = `${import.meta.env.VITE_BASE_API}/history-peminjaman`;
const BASE_URL_MAHASISWA = `${import.meta.env.VITE_BASE_API}/mahasiswa`;

const HisPeminjamanComponent = () => {
    const [data, setData] = useState([]);
    const [availableMahasiswa, setAvailableMahasiswa] = useState([]);
    const [filters, setFilters] = useState({
        sfilter_mhs_id: '',
        sfilter_startdate: '',
        sfilter_enddate: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Number of items per page

    const getDataList = async() => {
        const { sfilter_mhs_id, sfilter_startdate, sfilter_enddate } = filters;
        const response = await axios.get(
            `${BASE_URL_HISTORY_PEMINJAMAN}?limit=${limit}&page=${currentPage}&sfilter_mhs_id=${sfilter_mhs_id}&sfilter_startdate=${sfilter_startdate}&sfilter_enddate=${sfilter_enddate}`
        );
        setData(response.data.data);
        setTotalPages(Math.ceil(response.data.total / limit));
    }

    const fetchAvailableMahasiswa = async () => {
        try {
            const response = await axios.get(`${BASE_URL_MAHASISWA}?limit=ALL`);
            setAvailableMahasiswa(response.data.data);
        } catch (error) {
            console.error('Error fetching available mahasiswa:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const applyFilters = () => {
        setCurrentPage(1); // Reset to first page when applying filters
        getDataList();
    };

    useEffect(() => {
        getDataList();
        fetchAvailableMahasiswa();
    }, [currentPage]);

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <Form.Group controlId="formMhsId">
                        <Form.Label className='fw-bold small'>Filter Mahasiswa</Form.Label>
                        <Form.Control
                            as="select"
                            name="sfilter_mhs_id"
                            value={filters.sfilter_mhs_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">Pilih Mahasiswa</option>
                            {availableMahasiswa.map((mhs) => (
                                <option key={mhs.mhs_id} value={mhs.mhs_id}>
                                    {mhs.mhs_nim} - {mhs.mhs_nama}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Stack direction="horizontal" gap={3} className='d-flex align-items-end'>
                        <div className="p-2">
                            <Form.Label className='fw-bold small'>Dari Tanggal</Form.Label>
                            <Form.Control
                                type="date"
                                name="sfilter_startdate"
                                value={filters.sfilter_startdate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="p-2">
                            <Form.Label className='fw-bold small'>Sampai Tanggal</Form.Label>
                            <Form.Control
                                type="date"
                                name="sfilter_enddate"
                                value={filters.sfilter_enddate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="p-2 ms-auto">
                            <Button
                                variant="primary"
                                onClick={applyFilters}
                            >
                                Filter Data
                            </Button>
                        </div>
                    </Stack>
                </div>
            </div>

            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mahasiswa</th>
                        <th>Keterangan</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.mhs_nama}</td>
                            <td>{item.his_description}</td>
                            <td>{moment(item.his_crttime).format('YYYY-MM-DD HH:mm:ss')}</td>
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
        </div>
    );
};

export default HisPeminjamanComponent;
