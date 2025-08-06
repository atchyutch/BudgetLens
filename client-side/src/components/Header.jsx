function Header(){
    return(
        <div>
            <header className="sticky top-0 z-50 w-full select-none
                   bg-gradient-to-r from-black via-zinc-900 to-neutral-800
                   shadow-xl ring-1 ring-neutral-700/40">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a href="/" className="text-2xl font-black tracking-wide text-slate-300 hover:text-white">
      BudgetLens 
    </a>

    <nav className="hidden gap-8 md:flex">
      {/* <a className="text-gray-300 transition-colors duration-200 hover:text-cyan-400" href="#">
        Dashboard
      </a>
      <a className="text-gray-300 transition-colors duration-200 hover:text-cyan-400" href="#">
        Analytics
      </a>
      <a className="text-gray-300 transition-colors duration-200 hover:text-cyan-400" href="#">
        Settings
      </a> */}
    </nav>

    <button
      className="md:hidden inline-flex h-10 w-10 items-center justify-center
                 rounded-md text-gray-100 hover:bg-neutral-700/50
                 focus:outline-none focus:ring-2 focus:ring-cyan-400">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
           viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</header>
        </div>
    );
}


export default Header;