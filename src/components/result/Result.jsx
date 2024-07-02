import Highlighted from "../highlighted/Highlighted"
import { Box, Text } from "@chakra-ui/react"

export default function Result({transcript}){
    return (
        <Text>
            {transcript.sentiment_analysis_results.map(result => 
                <>
                    <Highlighted 
                        text={result.text} 
                        sentiment={result.sentiment} 
                        entities={transcript.entities}/>
                </>
            )}
            <Box padding="10"/>
            <Text m="5">Confidence Level: {transcript.confidence}</Text>
            <Text m="5">Topic detected:</Text>
            <Text m="5">
                {Object.entries(transcript.iab_categories_result.summary).slice(0, 3).map(([topic, relevance]) => (
                    <Text key={topic}>{topic} at {relevance * 100} relevance</Text>
                ))}
            </Text>
        </Text>
    )
}