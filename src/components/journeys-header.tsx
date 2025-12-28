
'use client';

import { Button } from '@/components/ui/button';
import { UserCircle, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function JourneysHeader() {
    return (
        <header className="flex flex-col items-center text-center gap-4 mb-8">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4">
                <AvatarImage src="https://picsum.photos/seed/avatar/200" alt="User Avatar" />
                <AvatarFallback>
                    <UserCircle className="w-full h-full text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <div className="flex items-center justify-center gap-4">
                    <h1 className="text-2xl font-light">Chrono Alchemist</h1>
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </div>
                 <div className="flex items-center justify-center gap-8 text-sm">
                    <div><span className="font-bold">0</span> / 12 posts</div>
                    <div><span className="font-bold">144</span> followers</div>
                    <div><span className="font-bold">64</span> following</div>
                </div>
                <div>
                    <p className="font-bold">The Creator's Journey</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Documenting my journey through time and space. Each step a story, each moment an alchemy.
                    </p>
                </div>
            </div>
        </header>
    );
}
