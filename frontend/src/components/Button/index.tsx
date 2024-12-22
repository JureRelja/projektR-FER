export default function Index({ label, onClick }: { label: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
    return (
        <button
            className="bg-blue-500 min-w-fit hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-fit focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 hover: shadow-md"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                onClick(event);
            }}>
            {label}
        </button>
    );
}
