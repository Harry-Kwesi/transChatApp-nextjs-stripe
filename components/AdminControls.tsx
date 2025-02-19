"use client";

import DeleteChatButton from "./DeleteChatButton";
import InviteUser from "./InviteUser";

interface AdminControlsProps {
    chatId: string;
}

function AdminControls({ chatId }: AdminControlsProps) {
    return (
        <div className="flex justify-end space-x-2 mb-5 mb-0">
            <InviteUser chatId={chatId}/>
            <DeleteChatButton chatId={chatId}/> 
        </div>
    );
}

export default AdminControls;