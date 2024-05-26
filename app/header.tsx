"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbutton } from "./nav-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
const routes = [
    {
        href: "/dashboard",
        label: "View All",
    },
    {
        href: "/Car/new",
        label: "Add Car",
    },
    {
        href: "/chat",
        label: "Chat",
    },

    {
        href: "/task",
        label: "Book appointment",
    },
    {
        href: "/",
        label: "Home"
    }
]
const Header = () => {
    const [isOpen, setisOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const onClick = (href: string) => {
        router.push(href)
        setisOpen(false)
    }
        return (
            <Sheet open={isOpen} onOpenChange={setisOpen}>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition">
                        <Menu className="size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button key={route.href}
                                variant={route.href === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(route.href)}
                                className="w-full justify-start">
                                {route.label}
                            </Button>

                        ))}
                    </nav>
                </SheetContent>

            </Sheet>
        )
    }


export default Header;