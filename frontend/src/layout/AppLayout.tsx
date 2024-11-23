import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="flex flex-col justify-between items-center h-[100vh] w-full ">
            <header className="border-b-[1px] border-gray-300 w-full text-center py-5">
                <h1 className="text-3xl font-bold">Aplikacija za video, audio i tekstualnu komunikacju</h1>
            </header>

            <div className="w-[1000px] h-full my-5">
                <Outlet />
            </div>

            <footer className="flex flex-col gap-2 border-t-[1px] border-gray-300 w-full justify-center items-center py-5">
                <p className="font-bold">Aplikacija za video, audio i tekstualnu komunikacju</p>
                <p>Projekt u sklopu kolegija PROJEKT R, Fakultet elektrotehnike i računarstva, Sveučilište u Zagrebu</p>
                <p>Autor: Jure Reljanović</p>
            </footer>
        </div>
    );
}
