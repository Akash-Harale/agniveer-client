'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { isAuthenticated, logout, getCurrentUser, AUTH_CHANGE_EVENT } from "@/lib/auth";
import ProfileDropdown from "./ProfileDropdown";
import { styles } from "./styles";
import "./Navbar.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState<any>(null);

  // Check login status
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setUserEmail(currentUser?.email || "");
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserEmail("");
      }
    };

    checkAuth();

    window.addEventListener(AUTH_CHANGE_EVENT, checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowDropdown(false);
    setUserEmail("");
    alert("👋 Logout successful!");
    router.push("/");
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const isAgniveer = user?.role === 'agniveer';
  // CISF role check — adjust the role string to match your auth system
  const isCISF = user?.role === 'cisf' || user?.username?.toLowerCase() === 'cisf';

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav style={styles.nav}>
        {/* Left Menu */}
        <div style={styles.menu}>
          <Link href="/" style={isActive('/') ? styles.activeLink : styles.link}>Home</Link>

          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowAboutDropdown(true)}
            onMouseLeave={() => setShowAboutDropdown(false)}
          >
            <Link href="/about" style={isActive('/about') ? styles.activeLink : styles.link}>
              About
              <span style={{ fontSize: "12px", marginLeft: "6px" }}>▼</span>
            </Link>

            {showAboutDropdown && (
              <div style={styles.aboutDropdown}>
                <Link
                  href="/agniveer-rehabilitation"
                  style={styles.dropdownItem}
                  onClick={() => setShowAboutDropdown(false)}
                >
                  Agniveer Rehabilitation
                </Link>
                <Link
                  href="/agnipath"
                  style={styles.dropdownItemLast}
                  onClick={() => setShowAboutDropdown(false)}
                >
                  Agnipath
                </Link>
              </div>
            )}
          </div>

          <Link href="/dashboard/notifications" style={isActive('/dashboard/notifications') ? styles.activeLink : styles.link}>Notifications</Link>
          <Link href="/faq" style={isActive('/faq') ? styles.activeLink : styles.link}>FAQ</Link>
        </div>

        {/* Right Side */}
        <div style={styles.rightSide}>
          {isLoggedIn && (
            <div style={{ display: "flex", alignItems: "center", gap: "25px", marginRight: "20px" }}>

              {/* ── Agniveer role: show My Profile + Consent ── */}
              {isAgniveer ? (
                <>
                  <Link
                    href="/agniveerdashboard?tab=myprofile"
                    style={currentTab === 'myprofile' ? styles.activeLink : styles.link}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/agniveerdashboard?tab=consent"
                    style={currentTab === 'consent' ? styles.activeLink : styles.link}
                  >
                    Consent
                  </Link>
                </>
              ) : (
                /* ── All other roles: Dashboard + Query + role-specific extras ── */
                <>
                  <Link
                    href="/dashboard"
                    style={isActive('/dashboard') && pathname === '/dashboard' ? styles.activeLink : styles.link}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/query"
                    style={isActive('/dashboard/query') ? styles.activeLink : styles.link}
                  >
                    Query
                  </Link>

                  {/* ── CISF-only: Users tab ── */}
                  {isCISF && (
                    <Link
                      href="/dashboard/users"
                      style={isActive('/dashboard/users') ? styles.activeLink : styles.link}
                    >
                      Users
                    </Link>
                  )}

                  {/* ── Admin-only: MIS tab ── */}
                  {user?.role === 'admin' && (
                    <Link
                      href="/dashboard/mis"
                      style={isActive('/dashboard/mis') ? styles.activeLink : styles.link}
                    >
                      MIS
                    </Link>
                  )}
                </>
              )}
            </div>
          )}

          {!isLoggedIn ? (
            <Link href="/auth/userlogin" style={styles.loginBtn}>🔐 Login Portal</Link>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ProfileDropdown
                showDropdown={showDropdown}
                toggleDropdown={toggleDropdown}
                handleLogout={handleLogout}
                userEmail={userEmail}
              />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}