import React from 'react'
import { Box, Tooltip, Text } from '@chakra-ui/react'

const sentimentColour = {
    POSITIVE: 'lightgreen',
    NEGATIVE: 'pink',
    NEUTRAL: 'lightgray'
}

const Highlighted = ({text, sentiment, entities}) => {
    const entityText = entities.map((e) => e.text);
    const parts = text.split(new RegExp(`(${entityText.join('|')})`, 'g'));

    return (
        <Box as="mark" bg={sentimentColour[sentiment]} mr="1">
            {parts.map(part => {
                const matchingEntity = entities.find((e) => e.text === part);

                if(matchingEntity){
                    return (
                        <Tooltip label={matchingEntity.entity_type} key={part}>
                            <Text display="inline" fontSize="xl" fontWeight="bold">
                                {part} 
                            </Text>
                        </Tooltip>
                    )
                }

                return part;
            })}
        </Box>
    )
}

export default Highlighted