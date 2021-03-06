import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { searchTotalSales } from '../../redux/actions/reportActions';
import { getAllClients } from '../../redux/actions/clientActions';
import { sorting, commafy, buildFilter } from '../../utils/common';
import PageHeader from '../../components/core/PageHeader';
import moment from 'moment';

const TotalSales = (props: any) => {
    const [errors, setErrors] = useState({} as Error);
    const [title] = useState('Total Sales');
    const [orderBy, setOrderBy] = useState(false);
    const [field, setField] = useState('reportDate');
    const [params, setParams] = useState({
        begin_time: moment(new Date()).format('YYYY-MM-DD'),
        end_time: moment(new Date()).format('YYYY-MM-DD'),
        resourceId: '',
        type: ''
    });
    
    // From Reducer
    const UI = useSelector((state: any) => state.UI);
    const user = useSelector((state: any) => state.user);
    const report = useSelector((state: any) => state.report);
    const totalSales = report.reportTotalSales[0];
    const allClients = user.allClients

    useEffect(() => {
        getAllClients()
        handleSearch()
        if (UI.errors) {
            setErrors(UI.errors)
        }
    }, [])

    const getAllClients = () => {
		var data:any = {
			'filter': {
				'roles': 'stylist'
			}
		};
        data.filter.status = {
            $in: ['active']
        }
        var query = buildFilter(data)
        query.businessId =  localStorage.businessId
        props.getAllClients(query)
    }

    const handleChange = (event: any) => {
        setParams({
            ...params,
            [event.target.name]: event.target.value,
        });
    };

    const handleSearch = () => {
        var filter:any = {};
        if (params.resourceId) {
            filter.resourceId = params.resourceId;
        }
        if (params.type) {
            filter.type = params.type;
        }
        var data = Object.assign({}, {'filter': filter});
        var query = buildFilter(data);
        query.begin_time = params.begin_time
        query.end_time = params.end_time
        query.businessId =  localStorage.businessId
        props.searchTotalSales(query);
    };

    const handleSortChange = (key: any) => {
        if (field === key) {
            setOrderBy(!orderBy);
        } else {
            setOrderBy(true);
            setField(key);
        }
        sorting(totalSales.data, key, orderBy);
    };

    return (
        <React.Fragment>
            {user.authenticated && !UI.loading && (
                <React.Fragment>
                    <PageHeader title={title} />
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='wrapper wrapper-content animated fadeInRight'>
                                <div className='ibox float-e-margins m-b-none'>
                                    <div className='ibox-content'>
                                        <form role='form'>
                                            <div className='row'>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label>Start Date</label>
                                                        <input
                                                            type='date'
                                                            className='form-control'
                                                            name='begin_time'
                                                            value={params.begin_time}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label>End Date</label>
                                                        <input
                                                            type='date'
                                                            className='form-control'
                                                            name='end_time'
                                                            value={params.end_time}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                        <div>
                                                            <span className='text-danger'></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-sm-2'>
                                                    <div className='form-group'>
                                                        <label>Staff</label>
                                                        <select className='form-control' onChange={handleChange}
                                                            name='resourceId'>
                                                            <option value=''>All</option>
                                                            {allClients && allClients.length && (
                                                                allClients.map((value: any) => {
                                                                    return (
                                                                        <option value={value.id}>{value.name}</option>
                                                                    )
                                                                })
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-sm-2'>
                                                    <div className='form-group'>
                                                        <label>Type</label>
                                                        <select className='form-control' onChange={handleChange}
                                                            name='type'>
                                                            <option value=''>All</option>
                                                            <option value='products'>Products</option>
                                                            <option value='services'>Services</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-sm-2'>
                                                    <div className='form-group'>
                                                        <label>&nbsp;</label>
                                                        <div className='input-group'>
                                                            <button
                                                                className='btn btn-primary'
                                                                type='button'
                                                                onClick={(e) => handleSearch()}
                                                            >
                                                                Search
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className='hr-line-dashed'>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-12 table-responsive'>
                                                <table className='table table-striped table-bordered table-condensed align-middle dataTables-example'>
                                                    <thead>
                                                        {!UI.buttonLoading && totalSales &&
                                                            totalSales.data &&
                                                            totalSales.data.length ? (
                                                            <tr>
                                                                <th
                                                                    colSpan={6}
                                                                    className='text-left text-uppercase'
                                                                >
                                                                    TOTAL SALES
                                                                </th>
                                                                <th colSpan={5} className='text-center'>
                                                                    {moment(params.begin_time).format(
                                                                        'LL'
                                                                    )}{' '}
                                                                    -{' '}
                                                                    {moment(params.end_time).format(
                                                                        'LL'
                                                                    )}
                                                                </th>
                                                            </tr>
                                                        ) : (
                                                            <></>
                                                        )}
                                                        {!UI.buttonLoading && totalSales &&
                                                            totalSales.data &&
                                                            totalSales.data.length ? (
                                                                <tr className='ignore font-weight-bold'>
                                                                    <th>Summary</th>
                                                                    <th colSpan={4}></th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfAmount * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfTip * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfTax * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfTotal * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                            ) : (
                                                                <></>
                                                        )}
                                                        <tr key='header'>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'reportDate'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('reportDate')}
                                                            >
                                                                Date/Time
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'staffName'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('staffName')}
                                                            >
                                                                {' '}
                                                                Staff{' '}
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'clientName'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('clientName')}
                                                            >
                                                                Customer
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'itemNames'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('itemNames')}
                                                            >
                                                                {' '}
                                                                Services/Products
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'type'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('type')}
                                                            >
                                                                Type
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'amount'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('amount')}
                                                            >
                                                                Price
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'tip'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('tip')}
                                                            >
                                                                Tip
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'tax'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('tax')}
                                                            >
                                                                Tax
                                                            </th>
                                                            <th
                                                                style={{ textAlign: 'center' }}
                                                                className={
                                                                    field !== 'total'
                                                                        ? 'sorting'
                                                                        : orderBy
                                                                            ? 'sorting_asc'
                                                                            : 'sorting_desc'
                                                                }
                                                                onClick={(e) => handleSortChange('total')}
                                                            >
                                                                Total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {!UI.buttonLoading && totalSales &&
                                                            totalSales.data &&
                                                            totalSales.data.length ? (
                                                                totalSales.data.map((value: any) => {
                                                                    return (
                                                                        <tr className='gradeX'>
                                                                            <td>
                                                                                {moment(value.reportDate).format('LL LT')}
                                                                            </td>
                                                                            <td>{value.staffName}</td>
                                                                            <td>{value.clientName}</td>
                                                                            <td className='text-capitalize'>
                                                                                {value.itemNames}
                                                                            </td>
                                                                            <td className='text-capitalize'>
                                                                                {value.type}
                                                                            </td>
                                                                            <td className='text-center'>
                                                                                $
                                                                                {commafy(
                                                                                    (
                                                                                        Math.round(value.amount * 100) / 100
                                                                                    ).toFixed(2)
                                                                                )}
                                                                            </td>
                                                                            <td className='text-center'>
                                                                                $
                                                                                {commafy(
                                                                                    (
                                                                                        Math.round(value.tip * 100) / 100
                                                                                    ).toFixed(2)
                                                                                )}
                                                                            </td>
                                                                            <td className='text-center'>
                                                                                $
                                                                                {commafy(
                                                                                    (
                                                                                        Math.round(value.tax * 100) / 100
                                                                                    ).toFixed(2)
                                                                                )}
                                                                            </td>
                                                                            <td className='text-center'>
                                                                                $
                                                                                {commafy(
                                                                                    (
                                                                                        Math.round(value.total * 100) / 100
                                                                                    ).toFixed(2)
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                            <tr>
                                                                <td colSpan={9} className='text-center'>
                                                                    {!UI.buttonLoading ? 
                                                                        'No Reports' 
                                                                        :
                                                                        <div>
                                                                            <p className='fa fa-spinner fa-spin'></p> <br /> Please Wait , Loading... 
                                                                        </div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {!UI.buttonLoading && totalSales &&
                                                            totalSales.data &&
                                                            totalSales.data.length ? (
                                                                <tr className='ignore font-weight-bold'>
                                                                    <th>Summary</th>
                                                                    <th colSpan={4}></th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfAmount * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfTip * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfTax * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                    <th className='text-center'>
                                                                        $
                                                                        {commafy(
                                                                            (
                                                                                Math.round(
                                                                                    totalSales.summaryOfTotal * 100
                                                                                ) / 100
                                                                            ).toFixed(2)
                                                                        )}
                                                                    </th>
                                                                </tr>
                                                            ) : 
                                                            <></>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

const mapActionsToProps = {
    searchTotalSales,
    getAllClients
};

export default connect(null, mapActionsToProps)(TotalSales);
