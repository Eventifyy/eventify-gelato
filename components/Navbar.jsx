/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import LoginWrapper from "./LoginWrapper";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();

    const isActive = (pathname) => {
        return router.pathname === pathname;
    };

    return (
        <div className="flex justify-around p-6">
            <img src="./logo.png" alt="" width="150px" />
            <ul className="flex gap-3">
                <li className={isActive('/') ? "text-purple-500" : ''}>
                    <Link className="hover:opacity-75 lg:pl-5 lg:pr-5" href="/">Home</Link>
                </li>
                <li className={isActive('/events') ? "text-purple-500" : ''}>
                    <Link className="hover:opacity-75 lg:pl-5 lg:pr-5" href="/events">Events</Link>
                </li>
                <li className={isActive('/host') ? "text-purple-500" : ''}>
                    <Link className="hover:opacity-75 lg:pl-5 lg:pr-5" href="/host">Host</Link>
                </li>
                <li className={isActive('/dashboard') ? "text-purple-500" : ''}>
                    <Link className="hover:opacity-75 lg:pl-5 lg:pr-5" href="/dashboard">Dashboard</Link>
                </li>
            </ul>
            <LoginWrapper />
        </div>
    );
}
