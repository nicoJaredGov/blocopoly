'use client'

import { Box } from "@mui/material";
import Cell from "./cell";
import { defaultProperties, defaultPropertyBlocks } from "./config/defaultProperties";

export default function Board() {
    return (
        <Box
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(11, 73px)',
                gridTemplateRows: 'repeat(11, 73px)',
                gap: '0px',
                border: '2px solid black',
                width: 'fit-content',
                margin: '10px',
            }}
        >
            {defaultProperties.map((property, index) => (
                <Cell
                    key={index}
                    property={property}
                    color={!!property?.blockId ? defaultPropertyBlocks.get(property.blockId)?.color : undefined}
                />
            ))}
        </Box>
    );
}