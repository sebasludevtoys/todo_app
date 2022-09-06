import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Exercises", href: "/exercises" },
];

export default function Example() {
  const { status, data } = useSession();
  const handleClick = () => {
    if (status === "authenticated") signOut();
  };
  return (
    <header className='bg-indigo-600 px-10 py-5'>
      <nav className='flex justify-between'>
        <div className='flex gap-x-5'>
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className='text-base font-medium text-white hover:text-indigo-50'
            >
              <a>{link.name}</a>
            </Link>
          ))}
        </div>
        <div>
          <span>{status === "authenticated" && data.user?.email}</span>
        </div>
        <div>
          {status === "authenticated" && (
            <button onClick={handleClick}>logout</button>
          )}
        </div>
      </nav>
    </header>
  );
}

{
  /* <nav
className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex'
aria-label='Top '
>
<div className='w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none'>
  <div className='flex items-center'>
    <span className='sr-only'>Workflow</span>
    <div className='hidden ml-10 space-x-8 lg:block'>
      {navigation.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className='text-base font-medium text-white hover:text-indigo-50'
        >
          <a>{link.name}</a>
        </Link>
      ))}
    </div>
  </div>
  <div className='ml-10 space-x-4'>
    {status === "authenticated" && (
      <button onClick={handleClick}>logout</button>
    )}
  </div>
</div>
<div>
  <span>{status === "authenticated" && data.user?.email}</span>
</div>
<div className='py-4 flex flex-wrap justify-center space-x-6 lg:hidden'>
  {navigation.map((link) => (
    <a
      key={link.name}
      href={link.href}
      className='text-base font-medium text-white hover:text-indigo-50'
    >
      {link.name}
    </a>
  ))}
</div>
</nav> */
}
