import Link from "next/link";
import LoginWrapper from "./LoginWrapper";

export default function Navbar() {
    return (
        <div className="flex gap-3">
            <Link href="/">Home</Link>
            <Link href="/events">Events</Link>
            <Link href="/host">Host</Link>
            <Link href="/dashboard">Dashboard</Link>
            <LoginWrapper />
        </div>
    );
}
