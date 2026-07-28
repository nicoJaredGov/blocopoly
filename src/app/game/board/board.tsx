'use client'

import { Box } from "@mui/material";
import Cell from "./cell";
import { defaultProperties, defaultPropertyBlocks } from "./config/defaultProperties";

export default function Board() {
    return (
        <Box
            style={{
                backgroundColor: "#83d0e0",
                display: 'grid',
                gridTemplateColumns: '90px repeat(9, 58px) 90px',
                gridTemplateRows: '90px repeat(9, 58px) 90px',
                gap: '0px',
                border: '1px solid black',
                width: 'fit-content',
                margin: '10px',
            }}
        >
            {defaultProperties.map((property, index) => {
                const color = property.blockId !== undefined
                    ? defaultPropertyBlocks.get(property.blockId)?.color
                    : undefined;

                return (
                    <Cell
                        key={index}
                        property={property}
                        color={color}
                    />
                );
            })}
        </Box>
    );
}