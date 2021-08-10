import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logoutUser } from '../../redux/actions/userActions'

const SideMenu = (props: any) => {
	const [collapse, setCollapse] = useState({
		services: false,
		products: false,
		reports: false,
	})
	const logo = localStorage.getItem('logo')

	const location = useLocation()
	const { pathname } = location
	const splitLocation = pathname.split('/')

	const handleClickLogout = (e: any) => {
		e.preventDefault()
		props.logoutUser()
	}

	const handleChange = (e: any, name: any, value: any) => {
		e.persist()
		setCollapse(collapse => ({
			...collapse,
			[name]: value,
		}))
	}

	return (
		<div>
			{props.authenticated && (
				<ul className='nav metismenu'>
					<li className='nav-header'>
						<div className='dropdown profile-element'>
							<div
								style={{
									display: 'block',
									textAlign: 'left',
									fontSize: '18px',
									padding: '10px 0',
									color: '#fff',
									fontWeight: 'bold',
								}}
							>
								<img
									alt='logo'
									src={logo ? logo : process.env.PUBLIC_URL + 'assets/I-Salon-logo.png'}
									style={{ height: 'auto', border: '0', width: '50%', verticalAlign: 'middle' }}
								/>
							</div>
							<a data-toggle='dropdown' className='dropdown-toggle'>
								<span className='clear'>
									<span className='block m-t-xs'>
										<strong className='font-bold'>
											{props.user.firstName} {props.user.lastName}
										</strong>
									</span>
									<span className='block m-t-xs'>
										<strong className='font-bold'>
											{props.user.countryCode} {props.user.phoneNumber}
										</strong>
									</span>
									<span className='text-muted text-xs block'>
										{props.user.roles}&nbsp;
										<b className='caret'></b>
									</span>
								</span>
							</a>
							<ul className='dropdown-menu animated fadeInRight m-t-xs'>
								{props.user.roles && props.user.roles.includes('admin') && (
									<React.Fragment>
										<li>
											<Link to='/profile'>Profile</Link>
										</li>
										<li className='divider'></li>
									</React.Fragment>
								)}
								<li>
									<Link to='#' onClick={handleClickLogout}>
										Logout
									</Link>
								</li>
							</ul>
						</div>
						<div className='logo-element'>
							<img alt='sm-logo' src={logo ? logo : process.env.PUBLIC_URL + 'assets/I-Salon-logo.png'} />
						</div>
					</li>
					<li className={splitLocation[1] === 'dashboard' ? 'active' : ''}>
						<Link to='/dashboard'>
							<span className='nav-label'>Dashboard</span>
						</Link>
					</li>
					<li className={splitLocation[1] === 'clients' ? 'active' : ''}>
						<Link to='/clients'>
							<span className='nav-label'>Clients</span>
						</Link>
					</li>
					<li className={splitLocation[1] === 'staff' ? 'active' : ''}>
						<Link to='/staff'>
							<span className='nav-label'>Staff</span>
						</Link>
					</li>
					<li className={splitLocation[1] === 'schedule' ? 'active' : ''}>
						<Link to='/schedule'>
							<span className='nav-label'>Schedule</span>
						</Link>
					</li>
					<li className={splitLocation[1] === 'staff-schedule' ? 'active' : ''}>
						<Link to='/staff-schedule'>
							<span className='nav-label'>Staff Schedule</span>
						</Link>
					</li>
					<li
						className={`${splitLocation[1] === 'services' ? 'active' : ''} ${collapse.services ? 'slideddown' : ''}`}
						onClick={e => handleChange(e, 'services', !collapse.services)}
					>
						<a className='nav-second-level-label'>
							<span className='nav-label'>Services</span>
							<span className='fa arrow'></span>
						</a>
						<ul
							className={`nav nav-second-level ${splitLocation[1] !== 'services' && !collapse.services ? 'collapse' : ''
								}`}
						>
							<li>
								<Link to='/services/categories'>
									<span className='nav-label'>Categories</span>
								</Link>
							</li>
							<li>
								<Link to='/services'>
									<span className='nav-label'>Services</span>
								</Link>
							</li>
							<li>
								<Link to='/services/orders'>
									<span className='nav-label'>Orders</span>
								</Link>
							</li>
						</ul>
					</li>
					<li
						className={`${splitLocation[1] === 'products' ? 'active' : ''} ${collapse.products ? 'slideddown' : ''}`}
						onClick={e => handleChange(e, 'products', !collapse.products)}
					>
						<a className='nav-second-level-label'>
							<span className='nav-label'>Products</span>
							<span className='fa arrow'></span>
						</a>
						<ul
							className={`nav nav-second-level ${splitLocation[1] !== 'products' && !collapse.products ? 'collapse' : ''
								}`}
						>
							<li>
								<Link to='/products/categories'>
									<span className='nav-label'>Categories</span>
								</Link>
							</li>
							<li>
								<Link to='/products'>
									<span className='nav-label'>Products</span>
								</Link>
							</li>
							<li>
								<Link to='/products/orders'>
									<span className='nav-label'>Orders</span>
								</Link>
							</li>
						</ul>
					</li>
					<li
						className={`${splitLocation[1] === 'reports' ? 'active' : ''} ${collapse.reports ? 'slideddown' : ''}`}
						onClick={e => handleChange(e, 'reports', !collapse.reports)}
					>
						<a className='nav-second-level-label'>
							<span className='nav-label'>Reports</span>
							<span className='fa arrow'></span>
						</a>
						<ul
							className={`nav nav-second-level ${splitLocation[1] !== 'reports' && !collapse.reports ? 'collapse' : ''
								}`}
						>
							<li>
								<Link to='/reports/total_sales'>
									<span className='nav-label'>Total Sales</span>
								</Link>
							</li>
							<li>
								<Link to='/reports/estimated_payroll'>
									<span className='nav-label'>Estimated Payroll</span>
								</Link>
							</li>
							<li>
								<Link to='/reports/services_completed'>
									<span className='nav-label'>Services Completed</span>
								</Link>
							</li>
							<li>
								<Link to='/reports/product_sales'>
									<span className='nav-label'>Product Sales</span>
								</Link>
							</li>
							<li>
								<Link to='/reports/client_report'>
									<span className='nav-label'>Client Report</span>
								</Link>
							</li>
							<li>
								<Link to='/reports/staff_booking_analysis'>
									<span className='nav-label'>Staff Booking Analysis</span>
								</Link>
							</li>
							<li>
								<Link to='/reports/30_day_snapshot'>
									<span className='nav-label'>30 Day Snapshot</span>
								</Link>
							</li>
						</ul>
					</li>
					<li className={splitLocation[1] === 'insrtuctions' ? 'active' : ''}>
						<Link to='/insrtuctions'>
							<span className='nav-label'>Instructional Videos</span>
						</Link>
					</li>
					<li className={splitLocation[1] === 'messages' ? 'active' : ''}>
						<Link to='/messages'>
							<span className='nav-label'>Messages</span>
						</Link>
					</li>
					<li className={splitLocation[1] === 'terminals' ? 'active' : ''}>
						<Link to='/terminals'>
							<span className='nav-label'>Terminals</span>
						</Link>
					</li>
				</ul>
			)}
			{props.authenticated && props.user.roles && props.user.roles.includes('sadmin') && (
				<div>
					<ul className='nav metismenu' id='side-menu'>
						<li>
							<Link to='/users'>
								<span className='nav-label'>Users</span>
							</Link>
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

const mapStateToProps = (state: any) => ({
	authenticated: state.user.authenticated,
	user: state.user.credentials,
})

const mapActionsToProps = {
	logoutUser,
}

export default connect(mapStateToProps, mapActionsToProps)(SideMenu)
