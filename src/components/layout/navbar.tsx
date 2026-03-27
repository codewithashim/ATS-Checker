"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X, ChevronDown, Bell, User, Settings, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click for mobile menu and user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, showUserMenu]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mount state for SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  if (!isMounted) {
    return (
      <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg animate-pulse"></div>
              <span className="text-xl font-bold text-foreground">ATSChecker</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={`
        sticky top-0 z-50 transition-all duration-500 ease-out
        ${isScrolled 
          ? 'shadow-xl shadow-black/5' 
          : 'shadow-sm'
        }
      `}
      style={{
        background: isScrolled 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isScrolled 
          ? '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            aria-label="ATSChecker Home"
          >
            <div 
              className="relative flex items-center justify-center w-10 h-10 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 50%, var(--brand-primary-dark) 100%)',
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
              }}
            >
              <FileText className="w-5 h-5 text-white relative z-10" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-none">
              ATSChecker
            </span>
            <span className="text-xs text-gray-600 font-medium leading-none mt-0.5">
              AI Resume Optimizer
            </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: '/', label: 'Home', icon: null },
              { href: '/analyzer', label: 'Analyzer', icon: Sparkles },
              { href: '/dashboard', label: 'Dashboard', icon: null },
              { href: '/pricing', label: 'Pricing', icon: null },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`
                  relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  flex items-center space-x-2 group
                  ${isActiveRoute(href)
                    ? 'text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                  }
                `}
                style={{
                  backgroundColor: isActiveRoute(href) ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
                }}
                aria-current={isActiveRoute(href) ? 'page' : undefined}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="relative z-10">{label}</span>
                {isActiveRoute(href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full animate-pulse bg-indigo-600" />
                )}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold text-white flex items-center justify-center bg-red-500">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </Button>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl border bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Button>
                        <div className="border-t my-2" />
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={signOut}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign In / Get Started */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
                <Button 
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white border-0"
                >
                  <Link href="/auth/signup">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 rounded-xl hover:bg-indigo-50"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs font-bold text-white flex items-center justify-center bg-red-500">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </Button>
            )}
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`w-6 h-6 absolute transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`w-6 h-6 absolute transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          ref={menuRef}
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-out
            ${isMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0'
            }
          `}
        >
          <div 
            className="py-6 border-t border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
          >

            <div className="flex flex-col space-y-2 px-4">
              {[
                { href: '/', label: 'Home', icon: null },
                { href: '/analyzer', label: 'Resume Analyzer', icon: Sparkles },
                { href: '/dashboard', label: 'Dashboard', icon: null },
                { href: '/pricing', label: 'Pricing', icon: null },
              ].map(({ href, label, icon: Icon }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative px-4 py-4 rounded-xl font-medium transition-all duration-300 transform flex items-center space-x-3
                    ${isActiveRoute(href)
                      ? 'text-indigo-600 scale-[1.02] shadow-sm'
                      : 'text-gray-700 hover:text-indigo-600'
                    }
                    ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                  `}
                  style={{ 
                    transitionDelay: isMenuOpen ? `${index * 80}ms` : '0ms',
                    backgroundColor: isActiveRoute(href) ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActiveRoute(href) ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="relative z-10">{label}</span>
                  {isActiveRoute(href) && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full bg-indigo-600" />
                  )}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  <div className="pt-6 mt-6 border-t border-white/20">
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 py-3"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-3"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="justify-start text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 py-3"
                  >
                    <Link href="/auth/login">
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild
                    className="justify-start bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white py-3"
                  >
                    <Link href="/auth/signup">
                      <Sparkles className="h-4 w-4 mr-3" />
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
