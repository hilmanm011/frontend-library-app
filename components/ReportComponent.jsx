/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import axios from 'axios';

const BASE_URL_PEMINJAMAN_REPORT = `${import.meta.env.VITE_BASE_API}/peminjaman/report`;

const ReportComponent = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        sfilter_mhs_nim: '',
        sfilter_mhs_nama: '',
        sfilter_pmj_tglpeminjaman: '',
        sfilter_pmj_tglpengembalian: '',
        sfilter_pmj_statuspengembalian: '',
        sfilter_lama_pinjam_hari: '',
        sfilter_buk_id: '',
        sfilter_buk_judul: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Number of items per page

    const getDataList = async () => {
        try {
            const queryString = Object.keys(filters)
                .map(key => filters[key] ? `${key}=${filters[key]}` : '')
                .filter(Boolean)
                .join('&');

            const response = await axios.get(`${BASE_URL_PEMINJAMAN_REPORT}?limit=${limit}&page=${currentPage}&${queryString}`);
            setData(response.data.data);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error('Error fetching peminjaman:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters, [name]: value };
            setCurrentPage(1); // Reset to first page when applying filters
            getDataList(newFilters); // Fetch data with new filters
            return newFilters;
        });
    };

    useEffect(() => {
        getDataList();
    }, [currentPage]);

    return (
        <div>
            <div className="mb-3">
                <div className="row">
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>NIM</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="text"
                            name="sfilter_mhs_nim"
                            value={filters.sfilter_mhs_nim}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan NIM mahasiswa'
                        />
                    </div>
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>Nama</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="text"
                            name="sfilter_mhs_nama"
                            value={filters.sfilter_mhs_nama}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan nama mahasiswa'
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>Status</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            as="select"
                            name="sfilter_pmj_statuspengembalian"
                            value={filters.sfilter_pmj_statuspengembalian}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan status'
                        >
                            <option value="">Pilih Status</option>
                            <option value="Y">Selesai</option>
                            <option value="N">Dalam Peminjaman</option>
                        </Form.Control>
                    </div>
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>Lama Pinjam (hari)</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="number"
                            name="sfilter_lama_pinjam_hari"
                            value={filters.sfilter_lama_pinjam_hari}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan lama pinjam'
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>Judul Buku</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="text"
                            name="sfilter_buk_judul"
                            value={filters.sfilter_buk_judul}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan judul buku'
                        />
                    </div>
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>Tanggal Peminjaman</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="date"
                            name="sfilter_pmj_tglpeminjaman"
                            value={filters.sfilter_pmj_tglpeminjaman}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan tanggal peminjaman'
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>Tanggal Pengembalian</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="date"
                            name="sfilter_pmj_tglpengembalian"
                            value={filters.sfilter_pmj_tglpengembalian}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan tanggal pengembalian'
                        />
                    </div>
                    <div className='col-md-6'>
                        <Form.Label className='fw-bold small col-form-label col-md-6'>ID Buku</Form.Label>
                        <Form.Control
                            className="col-md-9"
                            type="text"
                            name="sfilter_buk_id"
                            value={filters.sfilter_buk_id}
                            onChange={handleFilterChange}
                            size="sm"
                            placeholder='Cari berdasarkan ID buku'
                        />
                    </div>
                </div>
            </div>



            <Table bordered hover className='mt-4'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>NIM Mahasiswa</th>
                        <th>Nama Mahasiswa</th>
                        <th>Status</th>
                        <th>Tanggal Peminjaman</th>
                        <th>Tanggal Pengembalian</th>
                        <th>Lama Pinjam (hari)</th>
                        <th>Buku</th>
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
                            <td>{moment(item.pmj_tglpengembalian).format('DD MMMM YYYY')}</td>
                            <td>{item.lama_pinjam_hari}</td>
                            <td>
                                <ul>
                                    {item.dtbuku.map((dt, index) => (
                                        <li key={index}>
                                            <span>ID: [{dt.buk_id}] Judul: [{dt.buk_judul}]</span>
                                        </li>
                                    ))}
                                </ul>
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
        </div>
    );
};

export default ReportComponent;
