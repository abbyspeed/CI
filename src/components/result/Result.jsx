import Highlighted from "../highlighted/Highlighted"
import { Text } from "@chakra-ui/react"

export default function Result({transcript}){
    return (
        <Text>
            {transcript.sentiment_analysis_results.map(result => 
                <Highlighted 
                    text={result.text} 
                    sentiment={result.sentiment} 
                    entities={transcript.entities}/>
            )}
        </Text>
    )
}