'use client'

import { Box } from "@mui/material";
import Cell from "./cell";
import { customProperties, customPropertyBlocks } from "./board_configs/customBoard";
import { OwnableProperty } from "../property/OwnableProperty";

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
            {customProperties.map((property, index) => {
                const color = property instanceof OwnableProperty
                    ? customPropertyBlocks.get(property.blockId)?.color
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