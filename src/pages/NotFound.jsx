import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-serif text-7xl text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 gradient-royal text-primary-foreground rounded-full text-sm uppercase tracking-[0.2em]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
