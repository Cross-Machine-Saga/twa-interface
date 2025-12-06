import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from '@tanstack/react-router';
import { toast } from "sonner";
import { Page, groq, prompt } from '@/lib/constants'
import { PageLayout } from '@/components/ui/page-layout';
import { RouletteWheel } from '@/components/wheel-roulette';
import { formatLocalDate, getMsUntilNextMidnight } from "@/helpers";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const Route = createFileRoute(Page.Roulette)({
    component: RouteComponent,
})

const level = 'easy';
const STORAGE_KEY = "csm-task-storage";

const fetchEmbroideryTasks = async (_: string = 'easy') => {
    // Get cached data
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            // битые данные - просто игнорим и перезапишем
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }

    // Get new data
    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "system",
                content:
                    "Ты помогаешь организовать вышивальные задания и отвечаешь строго в JSON.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_completion_tokens: 1000,
        reasoning_effort: "medium",
        stop: null
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    // Попробуем распарсить JSON
    let data;
    try {
        data = JSON.parse(content);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // на всякий случай обернём
        data = { raw: content };
    }

    return data;
}


function RouteComponent() {
    const now = new Date();
    const today = formatLocalDate(now);
    const msUntilMidnight = getMsUntilNextMidnight(now);

    const { isLoading, data } = useQuery({
        queryKey: ["embroideryTasks", level, today],
        queryFn: () => fetchEmbroideryTasks(level),
        staleTime: msUntilMidnight,
    });

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<boolean>(false);
    const [dialogDescription, setDialogDescription] = useState<boolean>(false);

    return (
        <PageLayout className="flex flex-col items-center mt-10 px-4">
            {isLoading ? null :
                <RouletteWheel
                    className='w-full h-full grow justify-center items-center'
                    items={data?.tasks.map((t: any) => t.title)}
                    onStart={() => {
                        toast.success('Крутите барабан!');
                    }}
                    onFinish={(_, index) => {
                        const findedTaskByIndex = data.tasks[index];
                        setDialogOpen(true);
                        setDialogTitle(findedTaskByIndex.title);
                        setDialogDescription(findedTaskByIndex.description);
                    }}
                />
            }
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">{dialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription className="text-foreground text-center text-base">{dialogDescription}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-card">Закрыть</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageLayout>
    )
}
