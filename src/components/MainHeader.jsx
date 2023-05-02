import { Fragment } from 'react'
import { Popover, Transition, } from '@headlessui/react'
import { Menu } from '@headlessui/react'
import { useState } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import Sign from "./connectWallet";
import {  Bars3Icon} from '@heroicons/react/24/outline'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { eventify } from '../assets'
import { Link} from 'react-router-dom'







function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MainHeader() {
  
  const [open, setOpen] = useState(false);

  const handleClickOpen = () =>{
    setOpen(true);
  }
  const handleClose = () =>{
    setOpen(false);
  }


  
  return (
    <Popover className="relative bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 md:justify-start md:space-x-10">
           <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto sm:h-10"
                src={eventify}
                alt=""
              />
            </Link>
            {/* <Link to="/">
              <Image src="/logo.svg" width="120" height="148">
              </Image>
              </Link> */}
          </div>
          {/*<div className="-my-2 -mr-2 md:hidden">
            
            <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none ">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div> */}
          
          <Menu as="div" className="relative inline-block text-left -my-2 -mr-2 z-[999] md:hidden">
        {({ close, open }) => (
          <Fragment>
            <div >
              <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none ">
              <span className="sr-only">Options</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
              <Menu.Item as={Link} to='/'>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Home
                    </button>
                  )}
                </Menu.Item>
              <Menu.Item as={Link} to='/dashboard'>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Dashboard
                    </button>
                  )}
                </Menu.Item>
                
                
                
              </div>
              <div className="px-1 py-1">
              <Menu.Item as={Link} to='/host'>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Host
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item as={Link} to='/active'>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Active Events
                    </button>
                  )}
                </Menu.Item>
                
                
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {/* <Sign/> */}
                      Login
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Fragment>
        )}
      </Menu>
        {/* desktop navbar */}

          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
              <Popover className="relative">
              {({ open,close }) => (
                <>
          <Link to="/" className="text-base font-medium text-gray-500 hover:text-white hidden md:block">
              Home
            </Link>
    

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel  className="absolute z-[999] -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                      <div className="lg:h-96 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-y:scroll" >
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 scrollbar scrollbar-thumb-rose-500 scrollbar-track-slate-700" >
                          
                        </div>
                        <div className="space-y-6 bg-gray-50 px-5 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">

                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

            <Link to="/dashboard" className="text-base font-medium text-gray-500 hover:text-white sm:hidden md:flex">
              Dashboard
            </Link>
            <Link to="/host" className="text-base font-medium text-gray-500 hover:text-white sm:hidden md:flex">
              Host
            </Link>
            <Link to="/active" className="text-base font-medium text-gray-500 hover:text-white sm:hidden md:flex">
              Active Events
            </Link>
            {/* <Link to="/about" className="text-base font-medium text-gray-500 hover:text-black ">
              About Us
            </Link> */}

            {/* <Popover className="relative">
              {({ open,close }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? '' : '',
                      'group inline-flex items-center rounded-md text-base font-medium text-gray-500 hover:text-white focus:outline-none'
                    )}
                  >
                    <span>About Us</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-5 w-5 '
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-1/2 z-[999] mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                         
                        </div>
                        <div className="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8">
                          <div>
                            <h3 className="text-base font-medium text-gray-500">Active Events</h3>
                            <ul role="list" className="mt-4 space-y-4">

                            </ul>
                          </div>
                          <div className="mt-5 text-sm">
                            <Link to="/about/blogs" className="font-medium text-indigo-600"
                            onClick={()=>{
                              close();
                              console.log('click about us')
                            }}>
                              View all posts
                              <span aria-hidden="true"> &rarr;</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover> */}
          </Popover.Group>
          
          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            {/* <Link to="#" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
              Book a free trial
            </Link> */}
                         <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-[#8A42D8] px-4 py-2 text-base font-normal text-[16px] text-white shadow-sm hover:bg-indigo-700 gap-[12px]">
                            {/* <Sign/> */}
                            Login
                         </a> 

          </div>
        </div>
      </div>



             
    
    </Popover>

    
  )
}