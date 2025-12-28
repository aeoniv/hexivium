
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { dataAnalysis } from '@/ai/flows/data-analysis-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';

export function DataAnalysisPageContent() {
    const [csvData, setCsvData] = useState('');
    const [question, setQuestion] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!csvData || !question) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide both CSV data and a question.',
            });
            return;
        }
        setIsLoading(true);
        setAnalysis('');
        try {
            const result = await dataAnalysis({ csvData, question });
            setAnalysis(result.analysis);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-headline">Data Analysis</h1>
                    <p className="text-muted-foreground mt-2">
                        Get insights from your data. Paste CSV content and ask a question.
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Dataset Analyzer</CardTitle>
                        <CardDescription>Paste your dataset as CSV and ask a natural language question about it.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="csv-data">CSV Data</Label>
                            <Textarea
                                id="csv-data"
                                placeholder="Paste your CSV data here, including the header row.&#10;e.g.&#10;id,name,value&#10;1,alpha,100&#10;2,beta,200"
                                value={csvData}
                                onChange={(e) => setCsvData(e.target.value)}
                                className="h-48 font-mono text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input
                                id="question"
                                placeholder="e.g., What is the average value?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                            {isLoading ? 'Analyzing...' : <> <Wand2 className="mr-2" /> Analyze Data </>}
                        </Button>
                    </CardFooter>
                </Card>

                {(isLoading || analysis) && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ) : (
                                <p className="text-foreground/90 whitespace-pre-wrap">{analysis}</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
